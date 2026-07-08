import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildHooksPrompt, parseHooksResponse, type GenContext } from "@/lib/promptEngine";
import { checkRateLimit, getClientKey } from "@/lib/rateLimit";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY manquante dans .env.local" },
      { status: 500 }
    );
  }

  if (!checkRateLimit(getClientKey(req), 10, 60_000)) {
    return NextResponse.json(
      { ok: false, error: "Trop de générations en peu de temps — réessaie dans une minute." },
      { status: 429 }
    );
  }

  let ctx: GenContext;
  try {
    ctx = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON invalide" }, { status: 400 });
  }

  if (!ctx.offre || !ctx.offre.trim()) {
    return NextResponse.json(
      { ok: false, error: "Décris au moins ton offre et ta cliente avant de générer." },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const { system, user } = buildHooksPrompt(ctx);
    // `thinking: disabled` : sans ça, le raisonnement interne de Sonnet 5 consomme le budget
    // de max_tokens avant le texte visible (même cause que le bug de troncature déjà traité
    // sur generate-full/route.ts, jamais reportée ici) ; cast nécessaire, cf. generate-full/route.ts.
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 500,
      thinking: { type: "disabled" },
      system,
      messages: [{ role: "user", content: user }],
    } as unknown as Anthropic.MessageCreateParamsNonStreaming);
    const output = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n")
      .trim();

    const { sujetChoisi, hooks } = parseHooksResponse(output, ctx.sujet || "");

    if (hooks.length < 1) {
      return NextResponse.json(
        {
          ok: false,
          error: `Réponse inattendue : "${output.slice(0, 200) || "(vide)"}" — réessaie.`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, sujetChoisi, hooks });
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
