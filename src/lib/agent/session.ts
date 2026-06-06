import { queueKnowledgeCandidate } from "@/lib/agent/knowledge-candidates";
import { prisma } from "@/lib/prisma";

export type InviteValidation =
  | {
      ok: true;
      invite: {
        id: string;
        token: string;
        label: string | null;
        conversationBudgetSec: number;
        usedConversationSec: number;
        expiresAt: Date;
        status: string;
      };
      secondsRemaining: number;
    }
  | { ok: false; reason: "not_found" | "expired" | "exhausted" | "revoked" };

export function computeInviteSecondsRemaining(invite: {
  conversationBudgetSec: number;
  usedConversationSec: number;
  expiresAt: Date;
  status: string;
}): number {
  const now = Date.now();
  if (invite.status === "revoked") return 0;
  if (invite.expiresAt.getTime() <= now) return 0;
  const budgetLeft = Math.max(
    0,
    invite.conversationBudgetSec - invite.usedConversationSec,
  );
  const wallClockLeft = Math.max(
    0,
    Math.floor((invite.expiresAt.getTime() - now) / 1000),
  );
  return Math.min(budgetLeft, wallClockLeft);
}

export async function validateInviteToken(
  token: string,
): Promise<InviteValidation> {
  const invite = await prisma.agentInvite.findUnique({ where: { token } });
  if (!invite) return { ok: false, reason: "not_found" };
  if (invite.status === "revoked") return { ok: false, reason: "revoked" };
  if (invite.expiresAt.getTime() <= Date.now()) {
    if (invite.status === "active") {
      await prisma.agentInvite.update({
        where: { id: invite.id },
        data: { status: "expired" },
      });
    }
    return { ok: false, reason: "expired" };
  }
  const secondsRemaining = computeInviteSecondsRemaining(invite);
  if (secondsRemaining <= 0) {
    if (invite.status === "active") {
      await prisma.agentInvite.update({
        where: { id: invite.id },
        data: { status: "exhausted" },
      });
    }
    return { ok: false, reason: "exhausted" };
  }
  return { ok: true, invite, secondsRemaining };
}

export async function startAgentSession(token: string) {
  const validation = await validateInviteToken(token);
  if (!validation.ok) return validation;

  const session = await prisma.agentSession.create({
    data: {
      inviteId: validation.invite.id,
      accessType: "invite",
    },
  });

  return {
    ok: true as const,
    sessionId: session.id,
    secondsRemaining: validation.secondsRemaining,
    label: validation.invite.label,
  };
}

export async function getSessionWithBudget(sessionId: string) {
  const session = await prisma.agentSession.findUnique({
    where: { id: sessionId },
    include: { invite: true },
  });
  if (!session) return null;
  if (session.endedAt) return { session, secondsRemaining: 0 };

  if (session.invite) {
    const validation = await validateInviteToken(session.invite.token);
    if (!validation.ok) return { session, secondsRemaining: 0 };
    const inviteRemaining = validation.secondsRemaining;
    const sessionRemaining = Math.max(
      0,
      inviteRemaining - session.usedSeconds,
    );
    return { session, secondsRemaining: sessionRemaining };
  }

  return { session, secondsRemaining: 0 };
}

export async function recordAgentExchange(input: {
  sessionId: string;
  question: string;
  answer: string;
  citations: unknown;
  elapsedSec: number;
  refused?: boolean;
}) {
  const ctx = await getSessionWithBudget(input.sessionId);
  if (!ctx || ctx.secondsRemaining <= 0) {
    return { ok: false as const, reason: "budget_exhausted" as const };
  }

  const elapsed = Math.min(input.elapsedSec, ctx.secondsRemaining);

  const agentMessage = await prisma.$transaction(async (tx) => {
    await tx.agentMessage.create({
      data: {
        sessionId: input.sessionId,
        role: "user",
        content: input.question,
      },
    });
    const agent = await tx.agentMessage.create({
      data: {
        sessionId: input.sessionId,
        role: "agent",
        content: input.answer,
        citations: input.citations as object,
      },
    });
    await tx.agentSession.update({
      where: { id: input.sessionId },
      data: {
        usedSeconds: { increment: elapsed },
        endedAt:
          ctx.secondsRemaining - elapsed <= 0 ? new Date() : undefined,
      },
    });
    if (ctx.session.inviteId) {
      await tx.agentInvite.update({
        where: { id: ctx.session.inviteId },
        data: { usedConversationSec: { increment: elapsed } },
      });
    }
    return agent;
  });

  if (!input.refused) {
    await queueKnowledgeCandidate({
      sessionId: input.sessionId,
      messageId: agentMessage.id,
      question: input.question,
      answer: input.answer,
      citations: input.citations as { sources?: string[]; claims?: unknown[] },
    });
  }

  return {
    ok: true as const,
    secondsRemaining: Math.max(0, ctx.secondsRemaining - elapsed),
  };
}
