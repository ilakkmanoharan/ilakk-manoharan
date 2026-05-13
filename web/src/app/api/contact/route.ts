import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRequestIp, isHoneypotTripped } from "@/lib/request";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { contactMessageSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const key = clientKey(ip, "contact");
  if (!rateLimit(key, 15)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isHoneypotTripped(body)) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactMessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await prisma.contactMessage.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
