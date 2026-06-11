import { NextResponse } from "next/server";
import { z } from "zod";
import { buildQueryResultFromClaims } from "@/lib/agent/retrieve-claims";
import { getRequestIp } from "@/lib/request";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  question: z.string().min(2).max(500),
});

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const key = clientKey(ip, "agent-demo");
  if (!rateLimit(key, 20)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

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

  const result = await buildQueryResultFromClaims(parsed.data.question, null);

  return NextResponse.json({
    answer: result.answer,
    sources: result.sources,
    claims: result.claims,
    refused: result.refused,
    confidence: result.confidence,
    retrieval: "tfidf-knowledge-graph",
  });
}
