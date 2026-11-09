import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ViewTracker } from "@/components/view-tracker";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  loadLiveKitContributions,
  statusLabel,
  type OpenSourceContributionItem,
} from "@/lib/open-source-contributions";

export const metadata: Metadata = {
  title: "LiveKit contributions",
  description:
    "Open-source contributions to LiveKit Agents focused on hermetic tests, optional plugin boundaries, and contributor developer experience.",
};

function ItemBadge({ item }: { item: OpenSourceContributionItem }) {
  const label =
    item.kind === "pull"
      ? item.state === "merged"
        ? "Merged PR"
        : "Pull request"
      : "Issue";
  return <Badge variant="outline">{label}</Badge>;
}

export default function LiveKitContributionsPage() {
  const data = loadLiveKitContributions();
  const pulls = data?.items.filter((i) => i.kind === "pull") ?? [];
  const issues = data?.items.filter((i) => i.kind === "issue") ?? [];

  return (
    <>
      <ViewTracker
        path="/projects/livekit"
        resourceType="project"
        resourceSlug="livekit"
      />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm text-muted-foreground">
          <Link href="/projects" className="text-primary hover:underline">
            Projects
          </Link>
          <span aria-hidden> · </span>
          Open Source Contributions
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          LiveKit
        </h1>
        <p className="mt-3 text-muted-foreground">
          My contributions to{" "}
          <a
            href={data?.repoUrl ?? "https://github.com/livekit/agents"}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            livekit/agents
          </a>{" "}
          focus on improving test reliability and the developer experience—
          keeping hermetic unit tests free of optional plugins, network
          downloads, and unexpected environment mutation.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <a
            href={data?.repoUrl ?? "https://github.com/livekit/agents"}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Repository
          </a>
          {data?.syncedAt ? (
            <span className="text-muted-foreground">
              Contribution list synced{" "}
              {new Date(data.syncedAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          ) : null}
        </div>

        <section className="mt-12" aria-labelledby="overview-heading">
          <h2
            id="overview-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Overview
          </h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              In my first pull request, I addressed a hidden dependency in the
              tokenizer unit tests: collecting the tests could trigger an NLTK
              model download. I separated NLTK-specific coverage into dedicated
              plugin tests, moved model preparation into an explicit fixture,
              and updated CI and contributor documentation. This lets the core
              tokenizer tests run without NLTK or network access while
              preserving batch and streaming coverage.
            </p>
            <p>
              I verified the change by running 63 core tokenizer tests with
              networking blocked and NLTK imports disabled. Both dedicated NLTK
              tests also passed, along with formatting, lint, and type checks.
            </p>
            <p>
              Follow-up work audited import-time side effects in TTS tests,
              opened an issue to discuss environment mutation during collection,
              and submitted a fix that preserves shell environment values when
              loading dotenv.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="prs-heading">
          <h2
            id="prs-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Pull requests
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Status and links refresh from GitHub via{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              npm run open-source:sync-livekit
            </code>
            .
          </p>

          <div className="mt-6 space-y-5">
            {pulls.length === 0 ? (
              <p className="text-muted-foreground">
                No pull requests synced yet. Run the LiveKit sync script.
              </p>
            ) : (
              pulls.map((pr) => (
                <Card key={pr.number} className="border-border/80 shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <ItemBadge item={pr} />
                      <Badge variant="secondary">{statusLabel(pr.state)}</Badge>
                    </div>
                    <CardTitle className="font-heading text-xl leading-snug">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-primary"
                      >
                        #{pr.number} — {pr.contribution}
                        <ExternalLink className="size-4 shrink-0" aria-hidden />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {pr.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{pr.detail}</p>
                    <p>
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        View the contribution
                      </a>
                      {pr.mergedAt ? (
                        <span>
                          {" "}
                          · merged{" "}
                          {new Date(pr.mergedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      ) : (
                        <span>
                          {" "}
                          · opened{" "}
                          {new Date(pr.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        {issues.length > 0 ? (
          <section className="mt-12" aria-labelledby="issues-heading">
            <h2
              id="issues-heading"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              Related issues
            </h2>
            <div className="mt-6 space-y-5">
              {issues.map((issue) => (
                <Card key={issue.number} className="border-border/80 shadow-sm">
                  <CardHeader className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <ItemBadge item={issue} />
                      <Badge variant="secondary">
                        {statusLabel(issue.state)}
                      </Badge>
                    </div>
                    <CardTitle className="font-heading text-xl leading-snug">
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-primary"
                      >
                        #{issue.number} — {issue.contribution}
                        <ExternalLink className="size-4 shrink-0" aria-hidden />
                      </a>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {issue.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>{issue.detail}</p>
                    <p>
                      <a
                        href={issue.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        View the issue
                      </a>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-12 text-sm text-muted-foreground">
          <Link href="/projects" className="text-primary hover:underline">
            ← Back to projects
          </Link>
        </p>
      </div>
    </>
  );
}
