import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentClientId } from "@/lib/auth";

export async function GET() {
  const clientId = await getCurrentClientId();
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT id, format, role, texte, created_at
      FROM contenus_sauvegardes
      WHERE client_id = ${clientId}
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ ok: true, items: rows });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const clientId = await getCurrentClientId();
  if (!clientId) {
    return NextResponse.json({ ok: false, error: "Non autorisé." }, { status: 401 });
  }

  let body: { format?: string; role?: string; texte?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (!body.format || !body.role || !body.texte) {
    return NextResponse.json({ ok: false, error: "Champs manquants." }, { status: 400 });
  }

  try {
    const rows = await sql`
      INSERT INTO contenus_sauvegardes (client_id, format, role, texte)
      VALUES (${clientId}, ${body.format}, ${body.role}, ${body.texte})
      RETURNING id, format, role, texte, created_at
    `;
    return NextResponse.json({ ok: true, item: rows[0] });
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur." }, { status: 500 });
  }
}
