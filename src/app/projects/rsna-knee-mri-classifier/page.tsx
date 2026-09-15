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
import { RsnaKneeDayCalendar } from "@/components/rsna-knee-day-calendar";
import { RsnaKneeScoreChart } from "@/components/rsna-knee-score-chart";
import {
  formatRsnaScore,
  formatScoreDelta,
  listRsnaDayDates,
  loadRsnaConfig,
  loadRsnaDay,
  loadRsnaScoreHistory,
  RSNA_GITHUB,
  RSNA_KAGGLE,
} from "@/lib/rsna-knee-research";

export const metadata: Metadata = {
  title: "RSNA Knee MRI Classifier",
  description:
    "Daily research log for RSNA Knee Abnormality Detection: Kaggle scores, hypotheses, concepts, and ASRA-aligned analysis.",
};

export default function RsnaKneeProjectPage() {
  const config = loadRsnaConfig();
  const history = loadRsnaScoreHistory();
  const dates = listRsnaDayDates().reverse();
  const latestDate = dates[0];
  const latestDay = latestDate ? loadRsnaDay(latestDate) : null;

  const prevBest =
    history.points.length >= 2
      ? history.points[history.points.length - 2]?.score
      : null;
  const latest = history.latestPublicScore;
  const deltaFromPrev =
    latest !== null && prevBest !== null && prevBest !== undefined
      ? latest - prevBest
      : null;

  return (
    <>
      <ViewTracker
        path="/projects/rsna-knee-mri-classifier"
        resourceType="project"
        resourceSlug="rsna-knee-mri-classifier"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">Kaggle</Badge>
          <Badge variant="secondary">ASRA</Badge>
          <Badge variant="secondary">Medical imaging</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          {config.title}
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {config.description} Competition:{" "}
          <a
            href={config.competitionUrl || RSNA_KAGGLE}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            RSNA Knee Abnormality Detection
          </a>
          . Daily project-page-agent runs at 11 PM America/Chicago.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={config.githubUrl || RSNA_GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href={config.competitionUrl || RSNA_KAGGLE}
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

        <section className="mt-10" aria-labelledby="status-heading">
          <h2
            id="status-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Status at a glance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {history.updatedAt
              ? `Updated ${new Date(history.updatedAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                  timeZone: "America/Chicago",
                })} CT`
              : "From research artifacts"}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Best public score</CardDescription>
                <CardTitle className="font-heading text-3xl">
                  {formatRsnaScore(history.bestPublicScore)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {history.bestScoreDate ?? "Not recorded"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Latest public score</CardDescription>
                <CardTitle className="font-heading text-3xl">
                  {formatRsnaScore(history.latestPublicScore)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Δ vs prior scored: {formatScoreDelta(deltaFromPrev)}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Submissions</CardDescription>
                <CardTitle className="font-heading text-3xl">
                  {history.totalSubmissions}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                {history.experimentDays} experiment day
                {history.experimentDays === 1 ? "" : "s"}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Latest day</CardDescription>
                <CardTitle className="text-base leading-snug">
                  {latestDate ? (
                    <Link
                      href={`/projects/rsna-knee-mri-classifier/daily/${latestDate}`}
                      className="text-primary hover:underline"
                    >
                      {latestDate}
                    </Link>
                  ) : (
                    "—"
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground line-clamp-3">
                {latestDay?.dailySummary ?? "Not recorded"}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="score-heading">
          <h2
            id="score-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Score history
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Chronological public scores and cumulative best (America/Chicago).
            Amber points mark all-time bests.
          </p>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <RsnaKneeScoreChart history={history} />
            </CardContent>
          </Card>
        </section>

        <section className="mt-12" aria-labelledby="calendar-heading">
          <h2
            id="calendar-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Research calendar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Click a date for that day&apos;s submissions, score movement,
            hypotheses, and analysis.
          </p>
          <Card className="mt-6">
            <CardContent className="pt-6">
              <RsnaKneeDayCalendar dates={[...dates].reverse()} />
            </CardContent>
          </Card>
        </section>

        {config.currentBestApproach ? (
          <section className="mt-12" aria-labelledby="approach-heading">
            <h2
              id="approach-heading"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              Current best-known approach
            </h2>
            <p className="mt-3 max-w-3xl text-muted-foreground">
              {config.currentBestApproach}
            </p>
          </section>
        ) : null}

        {config.activeResearchQuestions?.length ? (
          <section className="mt-12" aria-labelledby="questions-heading">
            <h2
              id="questions-heading"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              Active research questions
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {config.activeResearchQuestions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {latestDay?.analysis?.nextSteps?.length ? (
          <section className="mt-12" aria-labelledby="next-heading">
            <h2
              id="next-heading"
              className="font-heading text-2xl font-semibold tracking-tight"
            >
              Latest next steps
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
              {latestDay.analysis.nextSteps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-12" aria-labelledby="recent-heading">
          <h2
            id="recent-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Recent daily pages
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {dates.slice(0, 6).map((d) => {
              const day = loadRsnaDay(d);
              return (
                <Card key={d}>
                  <CardHeader>
                    <CardTitle className="font-heading text-lg">
                      <Link
                        href={`/projects/rsna-knee-mri-classifier/daily/${d}`}
                        className="hover:underline"
                      >
                        {d}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      Best{" "}
                      {formatRsnaScore(day?.scoreSummary?.bestScore ?? null)} ·{" "}
                      {day?.scoreSummary?.submissionCount ?? 0} submission
                      {(day?.scoreSummary?.submissionCount ?? 0) === 1
                        ? ""
                        : "s"}
                      {day?.scoreSummary?.newAllTimeBest
                        ? " · new all-time best"
                        : ""}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground line-clamp-4">
                    {day?.dailySummary ?? "Not recorded"}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}
