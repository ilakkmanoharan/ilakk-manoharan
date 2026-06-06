import type { Metadata } from "next";
import Link from "next/link";
import { AdminAgentInvites } from "@/components/admin-agent-invites";
import { listAgentInvites } from "@/lib/agent/admin-invites-actions";

export const metadata: Metadata = {
  title: "Admin — Agent",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminAgentPage() {
  let invites: Awaited<ReturnType<typeof listAgentInvites>> = [];
  let loadError: string | null = null;

  try {
    invites = await listAgentInvites();
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Failed to load invites";
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-3xl font-semibold">Agent invites</h1>
        <Link className="text-sm text-primary hover:underline" href="/admin">
          ← Admin home
        </Link>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Create private links for Ilak&apos;s general-Agent1. Export conversations
        locally with{" "}
        <code className="rounded bg-muted px-1 text-xs">
          npm run agent:export-conversations
        </code>
        .
      </p>
      <div className="mt-8">
        <AdminAgentInvites initialInvites={invites} loadError={loadError} />
      </div>
    </div>
  );
}
