import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [
    startupInterest,
    recruiterMessages,
    contactMessages,
    meetingRequests,
  ] = await Promise.all([
    prisma.startupInterestSubmission.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.recruiterMessage.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.contactMessage.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.meetingRequest.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
  ]);

  const projectViews = await prisma.pageAnalytics.groupBy({
    by: ["resourceSlug"],
    where: { resourceType: "project", viewedAt: { gte: since } },
    _count: { resourceSlug: true },
    orderBy: { _count: { resourceSlug: "desc" } },
    take: 8,
  });

  const startupViews = await prisma.pageAnalytics.groupBy({
    by: ["resourceSlug"],
    where: { resourceType: "startup", viewedAt: { gte: since } },
    _count: { resourceSlug: true },
    orderBy: { _count: { resourceSlug: "desc" } },
    take: 8,
  });

  const lines = [
    "Daily Portfolio Activity Summary — Ilak Manoharan",
    "",
    `Window: since ${since.toISOString()}`,
    "",
    `New startup interest submissions: ${startupInterest.length}`,
    `New recruiter messages: ${recruiterMessages.length}`,
    `New contact messages: ${contactMessages.length}`,
    `New meeting requests: ${meetingRequests.length}`,
    "",
    "Most viewed projects (slugs):",
    ...projectViews.map(
      (r) => `  - ${r.resourceSlug}: ${r._count.resourceSlug}`,
    ),
    "",
    "Most viewed startups (slugs):",
    ...startupViews.map(
      (r) => `  - ${r.resourceSlug}: ${r._count.resourceSlug}`,
    ),
  ];

  const body = lines.join("\n");
  const recipient = process.env.DAILY_SUMMARY_TO_EMAIL ?? "";
  const apiKey = process.env.RESEND_API_KEY;

  let emailOk = false;
  let emailError: string | null = null;

  if (apiKey && recipient) {
    try {
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
        to: recipient,
        subject: "Daily Portfolio Activity Summary — Ilak Manoharan",
        text: body,
      });
      emailOk = true;
    } catch (e) {
      emailError = e instanceof Error ? e.message : "send failed";
    }
  } else {
    emailError = "RESEND_API_KEY or DAILY_SUMMARY_TO_EMAIL not set";
  }

  await prisma.newsletterLog.create({
    data: {
      recipient: recipient || "none",
      subject: "Daily Portfolio Activity Summary — Ilak Manoharan",
      bodySummary: body.slice(0, 4000),
      success: emailOk,
      errorMessage: emailOk ? null : emailError,
    },
  });

  return NextResponse.json({
    ok: true,
    emailed: emailOk,
    counts: {
      startupInterest: startupInterest.length,
      recruiterMessages: recruiterMessages.length,
      contactMessages: contactMessages.length,
      meetingRequests: meetingRequests.length,
    },
  });
}
