import { NextResponse } from "next/server";
import { CREDIBILITE, getRoleOptionsMap } from "@/lib/promptEngine";

export async function GET() {
  return NextResponse.json({
    roles: getRoleOptionsMap(),
    offreTypes: Object.keys(CREDIBILITE),
  });
}
