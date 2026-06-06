#!/usr/bin/env tsx
/**
 * Export agent conversations from Prisma to private/conversations/
 */
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/lib/prisma";

type Flags = {
  force: boolean;
  dryRun: boolean;
  sessionId?: string;
  since?: string;
  label?: string;
};

function parseFlags(): Flags {
  const args = process.argv.slice(2);
  const flags: Flags = { force: false, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--force") flags.force = true;
    else if (a === "--dry-run") flags.dryRun = true;
    else if (a === "--session") flags.sessionId = args[++i];
    else if (a === "--since") flags.since = args[++i];
    else if (a === "--label") flags.label = args[++i];
  }
  return flags;
}

async function main() {
  const flags = parseFlags();
  const sinceDate = flags.since ? new Date(flags.since) : undefined;
  if (flags.since && Number.isNaN(sinceDate!.getTime())) {
    console.error("Invalid --since date");
    process.exit(1);
  }

  const sessions = await prisma.agentSession.findMany({
    where: {
      ...(flags.sessionId ? { id: flags.sessionId } : {}),
      ...(sinceDate ? { startedAt: { gte: sinceDate } } : {}),
      ...(flags.label ? { invite: { label: flags.label } } : {}),
    },
    include: {
      invite: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { startedAt: "asc" },
  });

  const dateDir = new Date().toISOString().slice(0, 10);
  const outRoot = path.join(process.cwd(), "private", "conversations", dateDir);
  if (!flags.dryRun) fs.mkdirSync(outRoot, { recursive: true });

  let exported = 0;
  for (const session of sessions) {
    if (session.exportedAt && !flags.force && !flags.sessionId) continue;

    const label = session.invite?.label?.replace(/[^\w.-]+/g, "_") ?? "session";
    const base = `${session.id}_${label}`;
    const jsonPath = path.join(outRoot, `${base}.json`);
    const mdPath = path.join(outRoot, `${base}.md`);

    const payload = {
      sessionId: session.id,
      accessType: session.accessType,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      usedSeconds: session.usedSeconds,
      invite: session.invite
        ? {
            id: session.invite.id,
            label: session.invite.label,
            token: "[redacted]",
          }
        : null,
      messages: session.messages,
    };

    const md = [
      `# Agent session ${session.id}`,
      "",
      `- Started: ${session.startedAt.toISOString()}`,
      `- Access: ${session.accessType}`,
      `- Used seconds: ${session.usedSeconds}`,
      "",
      ...session.messages.flatMap((m) => [
        `## ${m.role} (${m.createdAt.toISOString()})`,
        "",
        m.content,
        "",
      ]),
    ].join("\n");

    if (flags.dryRun) {
      console.log(`Would export ${jsonPath}`);
      exported++;
      continue;
    }

    fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2));
    fs.writeFileSync(mdPath, md);
    await prisma.agentSession.update({
      where: { id: session.id },
      data: { exportedAt: new Date() },
    });
    exported++;
  }

  console.log(`Exported ${exported} session(s) to ${outRoot}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
