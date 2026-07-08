import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildFullPrompt, type GenContext } from "@/lib/promptEngine";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

interface GenerateFullBody extends GenContext {
  chosenHook: string;
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY manquante dans .env.local" },
      { status: 500 }
    );
  }

  if (!checkRateLimit(getClientKey(req), 5, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Trop de générations en peu de temps — réessaie dans une minute." },
      { status: 429 }
    );
  }

  let body: GenerateFullBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  if (!body.chosenHook || !body.chosenHook.trim()) {
    return NextResponse.json(
      { ok: false, error: "Le hook choisi est manquant." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const MAX_TOKENS_PER_CALL = 4096;
  const MAX_CONTINUATIONS = 2;

  try {
    const { system, user } = buildFullPrompt(body, body.chosenHook);
    const messages: Anthropic.MessageParam[] = [{ role: "user", content: user }];

    let text = "";
    let stopReason: string | null = null;
    let lastUsage: Anthropic.Usage | undefined;

    for (let attempt = 0; attempt <= MAX_CONTINUATIONS; attempt++) {
      // `thinking` existe côté API mais pas encore dans les types de @anthropic-ai/sdk@0.27.3 installé ;
      // le SDK transmet le body tel quel au runtime, seul le type-check a besoin de ce cast.
      const message = await anthropic.messages.create({
        model: "claude-sonnet-5",
        max_tokens: MAX_TOKENS_PER_CALL,
        thinking: { type: "disabled" },
        system,
        messages,
      } as unknown as Anthropic.MessageCreateParamsNonStreaming);
      const chunk = message.content
        .filter((b) => b.type === "text")
        .map((b) => (b as { text: string }).text)
        .join("\n");

      text += chunk;
      stopReason = message.stop_reason;
      lastUsage = message.usage;

      if (stopReason !== "max_tokens" || attempt === MAX_CONTINUATIONS) break;

      messages.push(
        { role: "assistant", content: chunk },
        {
          role: "user",
          content:
            "Continue exactement là où tu t'es arrêté, sans rien répéter, jusqu'à la fin complète du gabarit (légende et hashtags compris si applicable).",
        }
      );
    }

    return NextResponse.json({
      ok: true,
      text: text.trim(),
      truncated: stopReason === "max_tokens",
      debug: { stop_reason: stopReason, usage: lastUsage },
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
