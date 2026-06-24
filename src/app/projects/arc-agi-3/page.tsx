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
  githubResearchUrl,
  loadArcAgi3Research,
} from "@/lib/arc-agi-3-research";

export const metadata: Metadata = {
  title: "ARC-AGI-3 Research",
  description:
    "Autonomous research timeline for ARC Prize 2026 (ARC-AGI-3): submissions, analysis, hypotheses, and strategies.",
};

export default function ArcAgi3ResearchPage() {
  const data = loadArcAgi3Research();
  const events = [...data.events].reverse();

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
          . Autonomous daily cycle: submission → logs → analysis → hypothesis →
          strategy → next experiment. Research record active until{" "}
          {data.research_end ?? "November 1, 2026"}.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/ilakkmanoharan/ilakk-manoharan/tree/main/arc-agi-3-research"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Research repository
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

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card id="latest-submission">
            <CardHeader>
              <CardTitle className="text-lg">Latest submission</CardTitle>
              <CardDescription>Kaggle status snapshot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">ID: </span>
                {data.latest_submission_id ?? "—"}
              </p>
              <p>
                <span className="font-medium text-foreground">Score: </span>
                {data.latest_score ?? "—"}
              </p>
            </CardContent>
          </Card>

          <Card id="latest-hypothesis">
            <CardHeader>
              <CardTitle className="text-lg">Latest hypothesis</CardTitle>
              <CardDescription>Most recent research artifact</CardDescription>
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
          Research timeline
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {events.length === 0
            ? "No events yet. Run the daily cycle locally with --dry-run or wait for the GitHub Actions schedule."
            : `${events.length} recorded event(s).`}
        </p>

        <div className="mt-6 space-y-4">
          {events.map((event, index) => (
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
                    {event.github_documents.map((doc) => (
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
      </div>
    </>
  );
}
