import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTracker } from "@/components/view-tracker";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Casmi26DayCalendar } from "@/components/casmi26-day-calendar";
import {
  formatCasmiScore,
  formatScoreDelta,
  hypothesisStatusLabel,
  listCasmiDayDates,
  loadCasmiDay,
} from "@/lib/casmi26-research";

type Props = {
  params: Promise<{ date: string }>;
};

export async function generateStaticParams() {
  return listCasmiDayDates().map((date) => ({ date }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  return {
    title: `CASMI 2026 — ${date}`,
    description: `Daily research page for Enveda CASMI 2026 on ${date}.`,
  };
}

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  const s = status.toLowerCase();
  if (s.includes("supported") && !s.includes("partially")) return "default";
  if (s.includes("reject")) return "destructive";
  return "secondary";
}

export default async function RsnaKneeDailyPage({ params }: Props) {
  const { date } = await params;
  const day = loadCasmiDay(date);
  if (!day) notFound();

  const dates = listCasmiDayDates();
  const s = day.scoreSummary;

  return (
    <>
      <ViewTracker
        path={`/projects/casmi26-structure-prediction/daily/${date}`}
        resourceType="project"
        resourceSlug="casmi26-structure-prediction"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/projects/casmi26-structure-prediction"
            className="text-primary hover:underline"
          >
            ← Enveda CASMI 2026
          </Link>
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          {date}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Generated{" "}
          {new Date(day.generatedAt).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "America/Chicago",
          })}{" "}
          CT · timezone {day.timezone}
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Daily summary
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                {day.dailySummary ?? "Not recorded"}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  Score movement
                </CardTitle>
                <CardDescription>
                  {s.newAllTimeBest ? "New all-time best today" : "Day stats"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div>
                    <dt className="text-muted-foreground">First → last</dt>
                    <dd className="font-medium">
                      {formatCasmiScore(s.firstScored)} →{" "}
                      {formatCasmiScore(s.lastScored)} (
                      {formatScoreDelta(s.dailyAbsoluteChange)})
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Best / worst</dt>
                    <dd className="font-medium">
                      {formatCasmiScore(s.bestScore)} /{" "}
                      {formatCasmiScore(s.worstScore)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      vs prior submission
                    </dt>
                    <dd className="font-medium">
                      {formatScoreDelta(s.changeFromPreviousSubmission)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">vs prior best</dt>
                    <dd className="font-medium">
                      {formatScoreDelta(s.changeFromPriorBest)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Mean / median</dt>
                    <dd className="font-medium">
                      {formatCasmiScore(s.meanScore)} /{" "}
                      {formatCasmiScore(s.medianScore)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Counts</dt>
                    <dd className="font-medium">
                      {s.scoredCount} scored · {s.failedOrPendingCount}{" "}
                      failed/pending · {s.submissionCount} total
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Casmi26DayCalendar dates={dates} selected={date} />
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Kaggle submissions
          </h2>
          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-3 py-2 font-medium">Time (CT)</th>
                  <th className="px-3 py-2 font-medium">Ref</th>
                  <th className="px-3 py-2 font-medium">Score</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                  <th className="px-3 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {day.submissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-4 text-muted-foreground"
                    >
                      Not recorded
                    </td>
                  </tr>
                ) : (
                  day.submissions.map((sub) => (
                    <tr key={sub.ref} className="border-b last:border-0">
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(sub.timestamp).toLocaleString("en-US", {
                          timeStyle: "short",
                          timeZone: "America/Chicago",
                        })}
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">{sub.ref}</td>
                      <td className="px-3 py-2">
                        {formatCasmiScore(sub.publicScore)}
                      </td>
                      <td className="px-3 py-2">{sub.status}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {sub.description ?? "Not recorded"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {day.conceptsImplemented?.length ? (
          <section className="mt-10">
            <h2 className="font-heading text-2xl font-semibold tracking-tight">
              Concepts in today&apos;s submissions
            </h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {day.conceptsImplemented.map((c) => (
                <Card key={c.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{c.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {c.why ? <p>{c.why}</p> : null}
                    {c.how ? (
                      <p>
                        <span className="font-medium text-foreground">
                          How:{" "}
                        </span>
                        {c.how}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Hypotheses
          </h2>
          <div className="mt-4 grid gap-4">
            {day.hypotheses.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not recorded</p>
            ) : (
              day.hypotheses.map((h) => (
                <Card key={h.id}>
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant(h.status)}>
                        {hypothesisStatusLabel(h.status)}
                      </Badge>
                      {h.confidence ? (
                        <Badge variant="outline">{h.confidence} confidence</Badge>
                      ) : null}
                      <span className="font-mono text-xs text-muted-foreground">
                        {h.id}
                      </span>
                    </div>
                    <CardTitle className="mt-2 font-heading text-lg">
                      {h.statement}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                    <p>
                      <span className="font-medium text-foreground">
                        Motivation:{" "}
                      </span>
                      {h.motivation ?? "Not recorded"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Change:{" "}
                      </span>
                      {h.changeBeingTested ?? "Not recorded"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Expected:{" "}
                      </span>
                      {h.expectedResult ?? "Not recorded"}
                    </p>
                    <p>
                      <span className="font-medium text-foreground">
                        Observed:{" "}
                      </span>
                      {h.observedResult ?? "Not recorded"}
                    </p>
                    {h.caveats ? (
                      <p className="sm:col-span-2">
                        <span className="font-medium text-foreground">
                          Caveats:{" "}
                        </span>
                        {h.caveats}
                      </p>
                    ) : null}
                    {h.linkedSubmissions?.length ? (
                      <p className="sm:col-span-2">
                        <span className="font-medium text-foreground">
                          Submissions:{" "}
                        </span>
                        {h.linkedSubmissions.join(", ")}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">What worked</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {(day.results?.whatWorked?.length
                  ? day.results.whatWorked
                  : ["Not recorded"]
                ).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                What did not work
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {(day.results?.whatDidNotWork?.length
                  ? day.results.whatDidNotWork
                  : ["Not recorded"]
                ).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Facts</p>
                <ul className="mt-1 list-disc pl-5">
                  {(day.analysis?.facts?.length
                    ? day.analysis.facts
                    : ["Not recorded"]
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Interpretations</p>
                <ul className="mt-1 list-disc pl-5">
                  {(day.analysis?.interpretations?.length
                    ? day.analysis.interpretations
                    : ["Not recorded"]
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Limitations & next steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div>
                <p className="font-medium text-foreground">Limitations</p>
                <ul className="mt-1 list-disc pl-5">
                  {(day.analysis?.limitations?.length
                    ? day.analysis.limitations
                    : ["Not recorded"]
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Next experiments</p>
                <ul className="mt-1 list-disc pl-5">
                  {(day.analysis?.nextSteps?.length
                    ? day.analysis.nextSteps
                    : ["Not recorded"]
                  ).map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            GitHub activity
          </h2>
          <Card className="mt-4">
            <CardContent className="pt-6 text-sm text-muted-foreground">
              {day.githubActivity?.note ? (
                <p>{day.githubActivity.note}</p>
              ) : null}
              {day.githubActivity?.commits?.length ? (
                <ul className="mt-3 list-disc pl-5">
                  {day.githubActivity.commits.map((c) => (
                    <li key={c.sha}>
                      <span className="font-mono text-xs">{c.sha.slice(0, 7)}</span>{" "}
                      {c.message}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2">Not recorded</p>
              )}
            </CardContent>
          </Card>
        </section>

        {day.warnings?.length ? (
          <p className="mt-8 text-xs text-muted-foreground">
            Warnings: {day.warnings.join(" · ")}
          </p>
        ) : null}
      </div>
    </>
  );
}
