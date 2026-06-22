import { NextResponse } from "next/server";
import { getCurrentWorkAnswer } from "@/lib/agent/current-work";

export async function GET() {
  const answer = getCurrentWorkAnswer();
  return NextResponse.json(answer);
}
