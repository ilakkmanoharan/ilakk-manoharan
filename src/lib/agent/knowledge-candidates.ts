import { prisma } from "@/lib/prisma";

export async function queueKnowledgeCandidate(input: {
  sessionId: string;
  messageId: string;
  question: string;
  answer: string;
  citations?: { sources?: string[]; claims?: unknown[] };
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await prisma.agentKnowledgeCandidate.upsert({
      where: { messageId: input.messageId },
      create: {
        sessionId: input.sessionId,
        messageId: input.messageId,
        question: input.question,
        answer: input.answer,
        citations: (input.citations ?? undefined) as object | undefined,
        status: "pending",
      },
      update: {},
    });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to queue candidate",
    };
  }
}
