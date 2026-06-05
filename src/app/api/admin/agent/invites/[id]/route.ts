import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminRequest } from "@/lib/admin-session";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  status: z.enum(["active", "revoked"]).optional(),
  extendDays: z.number().int().min(1).max(90).optional(),
  addConversationMinutes: z.number().int().min(1).max(120).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const existing = await prisma.agentInvite.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: {
    status?: string;
    expiresAt?: Date;
    conversationBudgetSec?: number;
  } = {};

  if (parsed.data.status) data.status = parsed.data.status;
  if (parsed.data.extendDays) {
    data.expiresAt = new Date(
      existing.expiresAt.getTime() +
        parsed.data.extendDays * 24 * 60 * 60 * 1000,
    );
    if (existing.status === "expired") data.status = "active";
  }
  if (parsed.data.addConversationMinutes) {
    data.conversationBudgetSec =
      existing.conversationBudgetSec +
      parsed.data.addConversationMinutes * 60;
    if (existing.status === "exhausted") data.status = "active";
  }

  const invite = await prisma.agentInvite.update({ where: { id }, data });
  return NextResponse.json({ invite });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const invite = await prisma.agentInvite.update({
    where: { id },
    data: { status: "revoked" },
  });
  return NextResponse.json({ invite });
}
