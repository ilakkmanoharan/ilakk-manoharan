import { NextResponse } from "next/server";
import { getRequestIp, isHoneypotTripped } from "@/lib/request";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { retrieveRecruiterAnswer } from "@/lib/recruiter-rag";
import { suggestedRecruiterQuestions } from "@/lib/recruiter-questions";
import { recruiterChatSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const key = clientKey(ip, "recruiter-chat");
  if (!rateLimit(key, 20)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isHoneypotTripped(body)) {
    return NextResponse.json({ answer: "", suggestions: [] });
  }

  const parsed = recruiterChatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { answer, matched } = retrieveRecruiterAnswer(parsed.data.question);

  return NextResponse.json({
    answer,
    matched,
    suggestions: suggestedRecruiterQuestions,
  });
}
