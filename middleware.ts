import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/acces", "/api/access", "/mentions-legales", "/confidentialite", "/cgv", "/offre", "/merci"];

function getValidCodes(): string[] {
  return (process.env.ACCESS_CODES ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
}

export function middleware(req: NextRequest) {
  const validCodes = getValidCodes();
  if (validCodes.length === 0) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("fc_access")?.value;
  if (cookie && validCodes.includes(cookie)) return NextResponse.next();

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
