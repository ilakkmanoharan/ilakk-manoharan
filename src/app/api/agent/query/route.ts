import { NextResponse } from "next/server";
import { z } from "zod";
import { runAgentQuery } from "@/lib/agent/query";

const schema = z.object({
  question: z.string().min(2).max(2000),
  token: z.string().optional(),
  sessionId: z.string().optional(),
  caller: z.string().optional(),
  elapsedSec: z.number().int().min(1).max(600).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const headerToken = request.headers.get("X-Agent-Invite-Token") ?? undefined;
  const result = await runAgentQuery({
    ...parsed.data,
    token: parsed.data.token ?? headerToken,
  });

  if ("status" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
