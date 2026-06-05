import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-session";
import { agentConfig } from "@/lib/agent/config";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  label: z.string().max(200).optional(),
  conversationMinutes: z.number().int().min(1).max(120).optional(),
  expiryDays: z.number().int().min(1).max(90).optional(),
});

export async function GET(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const invites = await prisma.agentInvite.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      _count: { select: { sessions: true } },
    },
  });
  return NextResponse.json({ invites });
}

export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const cfg = agentConfig();
  const minutes = parsed.data.conversationMinutes ?? cfg.defaultInviteBudgetSec / 60;
  const days = parsed.data.expiryDays ?? cfg.defaultInviteExpiryDays;
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const invite = await prisma.agentInvite.create({
    data: {
      token,
      label: parsed.data.label ?? null,
      conversationBudgetSec: minutes * 60,
      expiresAt,
    },
  });

  return NextResponse.json({
    invite,
    url: `/agent/g/${token}`,
  });
}
