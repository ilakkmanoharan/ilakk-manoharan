import { buildQueryResultFromClaims } from "@/lib/agent/retrieve-claims";
import { maybeParaphraseAnswer } from "@/lib/agent/llm";
import type { AgentQueryResult } from "@/lib/agent/types";
import {
  getSessionWithBudget,
  recordAgentExchange,
  validateInviteToken,
} from "@/lib/agent/session";

export async function runAgentQuery(input: {
  question: string;
  sessionId?: string;
  token?: string;
  caller?: string;
  elapsedSec?: number;
}): Promise<
  | (AgentQueryResult & { sessionId?: string; error?: undefined })
  | { error: string; status: number }
> {
  const question = input.question.trim();
  if (question.length < 2) {
    return { error: "Question too short", status: 400 };
  }

  let secondsRemaining: number | null = null;
  let sessionId = input.sessionId;

  if (sessionId) {
    const ctx = await getSessionWithBudget(sessionId);
    if (!ctx) return { error: "Session not found", status: 404 };
    if (ctx.secondsRemaining <= 0) {
      return { error: "Conversation budget exhausted", status: 403 };
    }
    secondsRemaining = ctx.secondsRemaining;
  } else if (input.token) {
    const validation = await validateInviteToken(input.token);
    if (!validation.ok) {
      return { error: "Invalid or expired invite", status: 404 };
    }
    secondsRemaining = validation.secondsRemaining;
  } else {
    return {
      error: "Invite token or session required",
      status: 401,
    };
  }

  let result = buildQueryResultFromClaims(question, secondsRemaining);
  result = await maybeParaphraseAnswer(question, result);

  if (sessionId) {
    const recorded = await recordAgentExchange({
      sessionId,
      question,
      answer: result.answer,
      citations: { claims: result.claims, sources: result.sources, caller: input.caller },
      elapsedSec: input.elapsedSec ?? 30,
    });
    if (!recorded.ok) {
      return { error: "Conversation budget exhausted", status: 403 };
    }
    result.conversationSecondsRemaining = recorded.secondsRemaining;
  }

  return { ...result, sessionId };
}
