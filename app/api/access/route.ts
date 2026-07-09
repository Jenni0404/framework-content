import { NextResponse } from "next/server";

function getValidCodes(): string[] {
  return (process.env.ACCESS_CODES ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const validCodes = getValidCodes();
  if (validCodes.length === 0) {
    return NextResponse.json({ ok: true });
  }

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  if (!body.code || !validCodes.includes(body.code)) {
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
