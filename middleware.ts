import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sql } from "@/lib/db";

const PUBLIC_PATHS = ["/acces", "/api/access", "/mentions-legales", "/confidentialite", "/cgv", "/offre", "/merci"];

async function isValidCode(code: string): Promise<boolean> {
  try {
    const rows = await sql`SELECT id FROM clients WHERE code_acces = ${code} LIMIT 1`;
    return rows.length > 0;
  } catch {
    // Base injoignable ou mal configurée : on refuse par sécurité, jamais on
    // n'ouvre l'accès par défaut.
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("fc_access")?.value;
  if (cookie && (await isValidCode(cookie))) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, error: "Accès non autorisé." }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/acces";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
