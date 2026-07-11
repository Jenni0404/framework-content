import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req: Request) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (!body.code) {
    return NextResponse.json({ ok: false, error: "Code incorrect." }, { status: 401 });
  }

  let exists = false;
  try {
    const rows = await sql`SELECT id FROM clients WHERE code_acces = ${body.code} LIMIT 1`;
    exists = rows.length > 0;
  } catch {
    return NextResponse.json({ ok: false, error: "Erreur serveur, réessaie." }, { status: 500 });
  }

  if (!exists) {
    return NextResponse.json({ ok: false, error: "Code incorrect." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("fc_access", body.code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return res;
}
