import { NextResponse } from "next/server";
import { z } from "zod";
import { startAgentSession } from "@/lib/agent/session";

const schema = z.object({
  token: z.string().min(8),
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
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const headerToken = request.headers.get("X-Agent-Invite-Token");
  const token = parsed.data.token || headerToken;
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const result = await startAgentSession(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 404 });
  }

  return NextResponse.json({
    sessionId: result.sessionId,
    secondsRemaining: result.secondsRemaining,
    label: result.label,
  });
}
