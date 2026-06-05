import { NextResponse } from "next/server";
import { buildAgentManifest } from "@/lib/agent/manifest";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return NextResponse.json(buildAgentManifest(), {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
