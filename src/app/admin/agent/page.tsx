import type { Metadata } from "next";
import Link from "next/link";
import { AdminAgentInvites } from "@/components/admin-agent-invites";
import { AdminAgentKnowledgeCandidates } from "@/components/admin-agent-knowledge-candidates";
import { listAgentInvites } from "@/lib/agent/admin-invites-actions";
import { listKnowledgeCandidates } from "@/lib/agent/knowledge-candidates-actions";

export const metadata: Metadata = {
  title: "Admin — Agent",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAgentPage() {
  let invites: Awaited<ReturnType<typeof listAgentInvites>> = [];
  let candidates: Awaited<ReturnType<typeof listKnowledgeCandidates>> = [];
  let loadError: string | null = null;

  try {
    [invites, candidates] = await Promise.all([
      listAgentInvites(),
      listKnowledgeCandidates(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load agent admin data";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold">Agent admin</h1>
        <Link className="text-sm text-primary hover:underline" href="/admin">
          ← Admin home
        </Link>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Invites, conversation export, and knowledge-graph promotion for Ilak&apos;s
        general-Agent1. Sync site content with{" "}
        <code className="rounded bg-muted px-1 text-xs">
          npm run agent:sync-knowledge
        </code>
        ; export chats with{" "}
        <code className="rounded bg-muted px-1 text-xs">
          npm run agent:export-conversations
        </code>
        .
      </p>
      <div className="mt-8 space-y-10">
        <AdminAgentKnowledgeCandidates
          initialCandidates={candidates}
          loadError={loadError}
        />
        <AdminAgentInvites initialInvites={invites} loadError={loadError} />
      </div>
    </div>
  );
}
