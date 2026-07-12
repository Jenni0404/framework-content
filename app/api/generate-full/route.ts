import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildFullPrompt, parseFullResponse, type GenContext } from "@/lib/promptEngine";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";
import { getCurrentClientId, getGenerationsRestantes, lowBalanceWarning } from "@/lib/auth";
import { sql } from "@/lib/db";

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

  const clientId = await getCurrentClientId();
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }
  const remainingBeforeGen = await getGenerationsRestantes(clientId);
  if (remainingBeforeGen === null) {
    return NextResponse.json({ ok: false, error: "Compte introuvable." }, { status: 401 });
  }
  if (remainingBeforeGen <= 0) {
    return NextResponse.json(
      { ok: false, error: "Tu as utilisé toutes tes générations. Achète un pack de générations pour continuer." },
      { status: 402 }
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

    const { text: gabarit, pourquoi } = parseFullResponse(text.trim());

    // Décompte atomique : la clause WHERE empêche de descendre sous 0 même en
    // cas de double requête simultanée. Le post est déjà généré à ce stade
    // (coût API déjà engagé) donc on le renvoie dans tous les cas, même si le
    // solde était déjà tombé à 0 entre-temps.
    const decRows = await sql`
      UPDATE clients SET generations_restantes = generations_restantes - 1
      WHERE id = ${clientId} AND generations_restantes > 0
      RETURNING generations_restantes
    `;
    const remaining = decRows.length > 0 ? (decRows[0].generations_restantes as number) : 0;

    return NextResponse.json({
      ok: true,
      text: gabarit,
      pourquoi,
      truncated: stopReason === "max_tokens",
      remaining,
      warning: lowBalanceWarning(remaining),
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
