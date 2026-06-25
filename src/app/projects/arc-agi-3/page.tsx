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
  EVENT_LABELS,
  effectiveLatestSubmissionId,
  formatArcAgi3Score,
  githubResearchTreeUrl,
  githubResearchUrl,
  latestCycleStatus,
  loadArcAgi3Research,
} from "@/lib/arc-agi-3-research";

export const metadata: Metadata = {
  title: "ARC-AGI-3 Research",
  description:
    "Autonomous research timeline for ARC Prize 2026 (ARC-AGI-3): submissions, analysis, hypotheses, and strategies.",
};

function statusBadgeVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  const s = status.toLowerCase();
  if (s.includes("succeed") || s.includes("complete") || s.includes("submitted")) {
    return "default";
  }
  if (s.includes("error") || s.includes("fail")) {
    return "destructive";
  }
  return "secondary";
}

export default function ArcAgi3ResearchPage() {
  const data = loadArcAgi3Research();
  const status = data.status_summary;
  const events = [...data.events].reverse();
  const timelinePreview = events.slice(0, 8);
  const latestSubmissionId = effectiveLatestSubmissionId(data);
  const score = formatArcAgi3Score(data.latest_score);
  const agentSubmission = status?.last_agent_submission;

  return (
    <>
      <ViewTracker
        path="/projects/arc-agi-3"
        resourceType="project"
        resourceSlug="arc-agi-3-research"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">Kaggle</Badge>
          <Badge variant="secondary">ASRA</Badge>
          <Badge variant="secondary">GitHub Actions</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ARC-AGI-3 Research Agent
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Adaptive scientific reasoning for{" "}
          <a
            href={data.competition_url}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            ARC Prize 2026 — ARC-AGI-3
          </a>
          . Daily cycle: submission → logs → analysis → hypothesis → strategy →
          next experiment. Research record active until{" "}
          {data.research_end ?? "November 1, 2026"}.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={githubResearchTreeUrl()}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Research log (GitHub)
          </a>
          <a
            href={data.competition_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Kaggle competition
          </a>
          <Link href="/asra" className="text-primary hover:underline">
            ASRA
          </Link>
          <Link href="/projects" className="text-primary hover:underline">
            All projects
          </Link>
        </div>

        {/* Concise status dashboard */}
        <section className="mt-10" aria-labelledby="status-heading">
          <h2
            id="status-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Status at a glance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.updated_at
              ? `Updated ${new Date(data.updated_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC`
              : "Live from research artifacts"}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Public score</CardDescription>
                <CardTitle className="font-heading text-3xl">{score}</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Gateway runs succeed; games not yet solved.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Latest Kaggle submission</CardDescription>
                <CardTitle className="text-base leading-snug">
                  {agentSubmission?.summary ??
                    status?.submission_history?.[0]?.name ??
                    "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {agentSubmission?.kernel_slug ? (
                  <span>{agentSubmission.kernel_slug}</span>
                ) : (
                  <span>ID {latestSubmissionId ?? "—"}</span>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Agent automation</CardDescription>
                <CardTitle className="text-base">
                  {status?.agent_auto_submit ? "Auto-submit ON" : "Manual"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {status?.next_cycle_utc ?? "14:00 UTC daily"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Notebook for next run</CardDescription>
                <CardTitle className="text-base">
                  {status?.notebook_status?.includes("bootstrap")
                    ? "Ready (bootstrap)"
                    : "Ready"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Last cycle: {latestCycleStatus(data)}
              </CardContent>
            </Card>
          </div>
        </section>

        {status?.current_hypothesis ? (
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current hypothesis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {status.current_hypothesis}
            </CardContent>
          </Card>
        ) : null}

        {status?.submission_history && status.submission_history.length > 0 ? (
          <section className="mt-10" aria-labelledby="history-heading">
            <h2
              id="history-heading"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              Submission history
            </h2>
            <div className="mt-4 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-[32rem] text-left text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Submission</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Score</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="hidden px-4 py-3 font-medium md:table-cell">
                      Note
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {status.submission_history.map((row) => (
                    <tr key={row.name} className="border-b last:border-0">
                      <td className="px-4 py-3 font-medium">{row.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {row.date}
                      </td>
                      <td className="px-4 py-3">{row.score}</td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadgeVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {status?.known_blockers && status.known_blockers.length > 0 ? (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Known gaps</CardTitle>
              <CardDescription>
                What the agent has not improved yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                {status.known_blockers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : null}

        {status?.planned_direction ? (
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Proposed next direction</CardTitle>
              <CardDescription>
                Bridging competition notebook work and ASRA-LoRA research
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{status.planned_direction}</p>
              {status.planned_direction_url ? (
                <a
                  href={status.planned_direction_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  ASRA-LoRA concept paper (SciLayer)
                </a>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card id="latest-submission">
            <CardHeader>
              <CardTitle className="text-lg">Timeline submission ID</CardTitle>
              <CardDescription>From agent API snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">ID: </span>
                {latestSubmissionId ?? "—"}
              </p>
              <p>
                <span className="font-medium text-foreground">Score: </span>
                {score}
              </p>
            </CardContent>
          </Card>

          <Card id="latest-hypothesis">
            <CardHeader>
              <CardTitle className="text-lg">Latest hypothesis doc</CardTitle>
              <CardDescription>Full research artifact</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              {data.latest_hypothesis_path ? (
                <a
                  href={githubResearchUrl(data.latest_hypothesis_path)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  {data.latest_hypothesis_path}
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </CardContent>
          </Card>
        </div>

        {data.latest_strategy_path ? (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Latest strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={githubResearchUrl(data.latest_strategy_path)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <ExternalLink className="size-4" aria-hidden />
                {data.latest_strategy_path}
              </a>
            </CardContent>
          </Card>
        ) : null}

        <h2 className="mt-12 font-heading text-2xl font-semibold tracking-tight">
          Agent timeline
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {events.length === 0
            ? "No events yet. Run the daily cycle locally with --dry-run or wait for the GitHub Actions schedule."
            : `Showing ${timelinePreview.length} of ${events.length} event(s), newest first.`}
        </p>

        <div className="mt-6 space-y-4">
          {timelinePreview.map((event, index) => (
            <Card key={event.id ?? `${event.date}-${event.time}-${index}`}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base">
                    {EVENT_LABELS[event.event_type] ?? event.event_type}
                  </CardTitle>
                  <Badge variant="outline" className="font-normal">
                    {event.date} {event.time}
                  </Badge>
                </div>
                {event.summary ? (
                  <CardDescription>{event.summary}</CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                {event.submission_id ? (
                  <p>
                    <span className="font-medium text-foreground">
                      Submission:{" "}
                    </span>
                    {event.submission_id}
                    {event.status ? ` · ${event.status}` : ""}
                    {event.score ? ` · score ${event.score}` : ""}
                  </p>
                ) : null}
                {event.github_documents.length > 0 ? (
                  <ul className="list-inside list-disc space-y-1">
                    {event.github_documents.slice(0, 4).map((doc) => (
                      <li key={doc}>
                        <a
                          href={githubResearchUrl(doc)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {doc}
                        </a>
                      </li>
                    ))}
                    {event.github_documents.length > 4 ? (
                      <li className="text-muted-foreground">
                        +{event.github_documents.length - 4} more
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                {event.kaggle_url ? (
                  <a
                    href={event.kaggle_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-3" aria-hidden />
                    Kaggle
                  </a>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        {events.length > timelinePreview.length ? (
          <p className="mt-4 text-sm text-muted-foreground">
            <a
              href={githubResearchTreeUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Full timeline on GitHub →
            </a>
          </p>
        ) : null}
      </div>
    </>
  );
}
