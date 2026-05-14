import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getRequestIp } from "@/lib/request";
import { clientKey, rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  path: z.string().min(1).max(500),
  resourceType: z.enum(["project", "startup", "skill", "page"]),
  resourceSlug: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  if (!rateLimit(clientKey(ip, "analytics"), 120)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await prisma.pageAnalytics.create({ data: parsed.data });

  return NextResponse.json({ ok: true });
}
