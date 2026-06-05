import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentChat } from "@/components/agent-chat";
import {
  computeInviteSecondsRemaining,
  validateInviteToken,
} from "@/lib/agent/session";

export const metadata: Metadata = {
  title: "Agent session",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AgentInvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const validation = await validateInviteToken(token);
  if (!validation.ok) notFound();

  const secondsRemaining = computeInviteSecondsRemaining(validation.invite);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <AgentChat
        inviteToken={token}
        label={validation.invite.label}
        initialSeconds={secondsRemaining}
      />
    </div>
  );
}
