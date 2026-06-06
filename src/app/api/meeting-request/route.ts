import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendNotificationEmail } from "@/lib/notify-email";
import { getRequestIp, isHoneypotTripped } from "@/lib/request";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { meetingRequestSchema } from "@/lib/validators";

function formatMeetingRequestEmail(data: {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  message?: string | null;
}) {
  const lines = [
    "New meeting request — Ilak Manoharan portfolio",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Company: ${data.company || "—"}`,
    `Role: ${data.role || "—"}`,
    "",
    `Reason: ${data.reason}`,
    `Preferred date: ${data.preferredDate}`,
    `Preferred time: ${data.preferredTime}`,
    "",
    `Message: ${data.message || "—"}`,
    "",
    "View in admin: https://ilakk-manoharan.vercel.app/admin",
  ];
  return lines.join("\n");
}

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const key = clientKey(ip, "meeting-request");
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

  const parsed = meetingRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await prisma.meetingRequest.create({ data: parsed.data });

  await sendNotificationEmail({
    subject: `Meeting request from ${parsed.data.name}`,
    text: formatMeetingRequestEmail(parsed.data),
  });

  return NextResponse.json({
    message:
      "Thanks — your meeting request was saved. Ilak will confirm or propose alternate times.",
  });
}
