"use server";

import fs from "node:fs";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-session";
import { invalidateClaimsCache } from "@/lib/agent/knowledge";
import { queueKnowledgeCandidate as queueKnowledgeCandidateDb } from "@/lib/agent/knowledge-candidates";
import { syncKnowledgeGraph } from "@/lib/agent/sync-knowledge";
import type { AgentClaim } from "@/lib/agent/types";
import { prisma } from "@/lib/prisma";

export type KnowledgeCandidateRow = {
  id: string;
  sessionId: string;
  messageId: string;
  question: string;
  answer: string;
  status: string;
  inviteLabel: string | null;
  createdAt: string;
  sources: string[];
};

async function requireAdmin() {
  if (!(await isAdminRequest())) {
    throw new Error("Unauthorized — log in again at /admin/login");
  }
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export async function listKnowledgeCandidates(): Promise<KnowledgeCandidateRow[]> {
  await requireAdmin();
  const rows = await prisma.agentKnowledgeCandidate.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      session: { include: { invite: true } },
    },
  });
  return rows.map((r) => {
    const citations = r.citations as { sources?: string[] } | null;
    return {
      id: r.id,
      sessionId: r.sessionId,
      messageId: r.messageId,
      question: r.question,
      answer: r.answer,
      status: r.status,
      inviteLabel: r.session.invite?.label ?? null,
      createdAt: r.createdAt.toISOString(),
      sources: citations?.sources ?? [],
    };
  });
}

export async function queueKnowledgeCandidate(
  input: Parameters<typeof queueKnowledgeCandidateDb>[0],
) {
  return queueKnowledgeCandidateDb(input);
}

export async function approveKnowledgeCandidate(
  id: string,
): Promise<{ ok: true; claimId: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const row = await prisma.agentKnowledgeCandidate.findUnique({ where: { id } });
    if (!row) return { ok: false, error: "Candidate not found" };
    if (row.status === "approved") {
      return { ok: false, error: "Already approved" };
    }

    const claimId = `claim-promoted-${slugify(row.question)}-${row.id.slice(-6)}`;
    const citations = row.citations as { sources?: string[] } | null;
    const claim: AgentClaim = {
      id: claimId,
      text: row.answer,
      topics: tokenizeTopics(row.question),
      sources:
        citations?.sources?.length
          ? citations.sources
          : ["https://ilakk-manoharan.vercel.app/agent"],
      origin: "conversation",
      verified: true,
      lastVerified: new Date().toISOString().slice(0, 10),
    };

    appendPromotedClaim(claim);
    await syncKnowledgeGraph();
    invalidateClaimsCache();

    await prisma.agentKnowledgeCandidate.update({
      where: { id },
      data: {
        status: "approved",
        promotedClaimId: claimId,
        reviewedAt: new Date(),
      },
    });

    revalidatePath("/admin/agent");
    return { ok: true, claimId };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Approve failed",
    };
  }
}

export async function rejectKnowledgeCandidate(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await prisma.agentKnowledgeCandidate.update({
      where: { id },
      data: { status: "rejected", reviewedAt: new Date() },
    });
    revalidatePath("/admin/agent");
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Reject failed",
    };
  }
}

function tokenizeTopics(question: string) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .slice(0, 8);
}

function appendPromotedClaim(claim: AgentClaim) {
  const file = path.join(process.cwd(), "content", "agent", "promoted-claims.json");
  const raw = fs.existsSync(file)
    ? (JSON.parse(fs.readFileSync(file, "utf8")) as { claims: AgentClaim[] })
    : { version: 1, claims: [] };
  raw.claims = raw.claims.filter((c) => c.id !== claim.id);
  raw.claims.push(claim);
  fs.writeFileSync(file, `${JSON.stringify(raw, null, 2)}\n`);
}
