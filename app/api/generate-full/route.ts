import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildFullPrompt, type GenContext } from "@/lib/promptEngine";

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

  try {
    const { system, user } = buildFullPrompt(body, body.chosenHook);
    const message = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2200,
      system,
      messages: [{ role: "user", content: user }],
    });
    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("\n")
      .trim();

    return NextResponse.json({ ok: true, text });
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
