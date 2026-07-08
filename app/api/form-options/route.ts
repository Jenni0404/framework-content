import { NextResponse } from "next/server";
import { CREDIBILITE, CTA_INFO, CTA_INFO_STORY, getRoleOptionsMap } from "@/lib/promptEngine";

export async function GET() {
  return NextResponse.json({
    roles: getRoleOptionsMap(),
    offreTypes: Object.keys(CREDIBILITE),
    ctaInfo: CTA_INFO,
    ctaInfoStory: CTA_INFO_STORY,
  });
}
