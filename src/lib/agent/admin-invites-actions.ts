"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-session";
import { agentConfig } from "@/lib/agent/config";
import { prisma } from "@/lib/prisma";

export type AdminInviteRow = {
  id: string;
  token: string;
  label: string | null;
  expiresAt: Date;
  conversationBudgetSec: number;
  usedConversationSec: number;
  status: string;
  createdAt: Date;
  sessionCount: number;
};

function dbErrorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/readonly|read-only|SQLITE_READONLY/i.test(message)) {
    return "Database is read-only on this host. Set a writable DATABASE_URL on Vercel (e.g. Turso or Postgres) — SQLite file writes do not persist in serverless.";
  }
  return message || "Database error";
}

async function requireAdmin() {
  if (!(await isAdminRequest())) {
    throw new Error("Unauthorized — log in again at /admin/login");
  }
}

export async function listAgentInvites(): Promise<AdminInviteRow[]> {
  await requireAdmin();
  try {
    const invites = await prisma.agentInvite.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { _count: { select: { sessions: true } } },
    });
    return invites.map((inv) => ({
      id: inv.id,
      token: inv.token,
      label: inv.label,
      expiresAt: inv.expiresAt,
      conversationBudgetSec: inv.conversationBudgetSec,
      usedConversationSec: inv.usedConversationSec,
      status: inv.status,
      createdAt: inv.createdAt,
      sessionCount: inv._count.sessions,
    }));
  } catch (error) {
    throw new Error(dbErrorMessage(error));
  }
}

export async function createAgentInvite(input: {
  label?: string;
  conversationMinutes: number;
  expiryDays: number;
}): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const cfg = agentConfig();
    const minutes = input.conversationMinutes || cfg.defaultInviteBudgetSec / 60;
    const days = input.expiryDays || cfg.defaultInviteExpiryDays;
    if (minutes < 1 || minutes > 120 || days < 1 || days > 90) {
      return { ok: false, error: "Invalid minutes or expiry days" };
    }

    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await prisma.agentInvite.create({
      data: {
        token,
        label: input.label?.trim() || null,
        conversationBudgetSec: minutes * 60,
        expiresAt,
      },
    });

    revalidatePath("/admin/agent");
    return { ok: true, url: `/agent/g/${token}` };
  } catch (error) {
    return { ok: false, error: dbErrorMessage(error) };
  }
}

export async function revokeAgentInvite(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    await prisma.agentInvite.update({
      where: { id },
      data: { status: "revoked" },
    });
    revalidatePath("/admin/agent");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: dbErrorMessage(error) };
  }
}
