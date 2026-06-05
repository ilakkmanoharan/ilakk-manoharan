import type { Metadata } from "next";
import Link from "next/link";
import { AdminAgentInvites } from "@/components/admin-agent-invites";

export const metadata: Metadata = {
  title: "Admin — Agent",
  robots: { index: false, follow: false },
};

export default function AdminAgentPage() {
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
        <AdminAgentInvites />
      </div>
    </div>
  );
}
