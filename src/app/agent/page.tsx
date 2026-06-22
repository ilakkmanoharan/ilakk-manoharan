import type { Metadata } from "next";
import Link from "next/link";
import { AgentPublicChat } from "@/components/agent-public-chat";
import { MeetMyAgent } from "@/components/meet-my-agent";
import { agentConfig } from "@/lib/agent/config";
import { buildAgentManifest } from "@/lib/agent/manifest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "General Agent",
  description:
    "Ilak's general-Agent1 — grounded portfolio representative with TF-IDF knowledge-graph retrieval and citations.",
};

export default function AgentPublicPage() {
  const cfg = agentConfig();
  const manifest = buildAgentManifest();
  const defaultChatMinutes = Math.round(cfg.defaultInviteBudgetSec / 60);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h2 className="font-heading text-2xl font-semibold">Meet My Agent</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        A friendly assistant avatar — ask about Ilak&apos;s current research project.
      </p>

      <div className="mt-6">
        <MeetMyAgent />
      </div>

      <h1 className="mt-12 font-heading text-3xl font-semibold">
        Ilak&apos;s general-Agent1
      </h1>
      <p className="mt-3 text-muted-foreground">
        A retrieval-first agent grounded in Ilak&apos;s verified knowledge graph —
        projects, ASRA, Nature Foundation Models, Orbit Wars, SciLayer preprints,
        and skills — with citations and no guessing.
      </p>

      <div className="mt-8">
        <AgentPublicChat />
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Private access</CardTitle>
          <CardDescription>
            Extended chat, HTTP API, and MCP require an invite link from Ilak.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            If you received <code>/agent/g/&#123;token&#125;</code>, open that
            link to start a timed session with a longer conversation budget.
          </p>
          <p>
            Machine manifest:{" "}
            <Link className="text-primary hover:underline" href="/.well-known/agent.json">
              /.well-known/agent.json
            </Link>
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Query API: {manifest.endpoints.query}</li>
            <li>MCP: {manifest.endpoints.mcp}</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Public access (${cfg.publicPriceUsd})</CardTitle>
          <CardDescription>
            Manual verification — no automated payment API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ol className="list-inside list-decimal space-y-2">
            <li>
              Send ${cfg.publicPriceUsd} via Zelle to{" "}
              <strong className="text-foreground">{cfg.zellePhone}</strong> with
              memo <strong className="text-foreground">{cfg.zelleMemo}</strong>{" "}
              and your email.
            </li>
            <li>
              Ilak verifies the deposit and emails a private invite link (typically{" "}
              {defaultChatMinutes} minutes chat, {cfg.defaultInviteExpiryDays}-day link
              expiry).
            </li>
          </ol>
          <p>
            Or{" "}
            <Link className="text-primary hover:underline" href="/contact">
              contact Ilak
            </Link>{" "}
            with payment proof to request access.
          </p>
        </CardContent>
      </Card>

      <p className="mt-8 text-xs text-muted-foreground">
        Policy: answers only from verified sources; refuses when uncertain; never
        infers salary, visa, or unreleased work without an explicit claim.
      </p>
    </div>
  );
}
