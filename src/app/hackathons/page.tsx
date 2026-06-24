import type { Metadata } from "next";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { loadHackathonsForPage } from "@/lib/hackathons-content";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Hackathons",
  description:
    "Hackathon submissions, datasets, models, and impact—compressed into recruiter-friendly narratives.",
};

export default async function HackathonsPage() {
  const items = loadHackathonsForPage();

  return (
    <>
      <ViewTracker
        path="/hackathons"
        resourceType="page"
        resourceSlug="hackathons"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Hackathons
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Rapid builds that stress-test product sense, modeling choices, and how
          a submission tells a crisp technical story end-to-end.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((h) => (
            <Card key={h.id} className="border-border/80">
              <CardHeader>
                <CardTitle className="font-heading text-xl">
                  {h.projectName}
                </CardTitle>
                <CardDescription>{h.hackathonName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="font-medium text-foreground">Problem: </span>
                  <span className="text-muted-foreground">
                    {h.problemAddressed}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Solution: </span>
                  <span className="text-muted-foreground">
                    {h.solutionSummary}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Dataset: </span>
                  <span className="text-muted-foreground">
                    {h.datasetUsed ?? "—"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Model / tech: </span>
                  <span className="text-muted-foreground">
                    {h.modelTech ?? "—"}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Technical contribution:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {h.technicalContribution}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Impact: </span>
                  <span className="text-muted-foreground">{h.impact}</span>
                </p>
                <p>
                  <span className="font-medium text-foreground">Result: </span>
                  <span className="text-muted-foreground">{h.statusResult}</span>
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  {h.githubUrl ? (
                    <a
                      href={h.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      GitHub
                    </a>
                  ) : null}
                  {h.slug === "asra" ? (
                    <Link
                      href="/asra"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      ASRA
                    </Link>
                  ) : null}
                  {h.slug === "arc-agi-3-research-agent" ? (
                    <Link
                      href="/projects/arc-agi-3"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      Research log
                    </Link>
                  ) : null}
                  {h.kaggleUrl ? (
                    <a
                      href={h.kaggleUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Kaggle
                    </a>
                  ) : null}
                  {h.demoVideo ? (
                    <a
                      href={h.demoVideo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      Demo video
                    </a>
                  ) : null}
                  {h.writeupLink ? (
                    <a
                      href={h.writeupLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      Writeup
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
