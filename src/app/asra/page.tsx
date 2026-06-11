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
import { asraPapers, asraVideos } from "@/lib/asra";

export const metadata: Metadata = {
  title: "ASRA",
  description:
    "Adaptive Scientific Reasoning Architecture (ASRA): action semantics inference, experiential memory, world models, and Decision Biology.",
};

export default function AsraPage() {
  return (
    <>
      <ViewTracker path="/asra" resourceType="page" resourceSlug="asra" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Research</Badge>
          <Badge variant="secondary">Scientific AI</Badge>
          <Badge variant="secondary">World models</Badge>
          <Badge variant="secondary">Action semantics</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ASRA
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          ASRA (Adaptive Scientific Reasoning Architecture) studies adaptive
          scientific reasoning in unfamiliar, partially observable environments.
          The core idea is intervention-centric learning: an agent observes,
          experiments, analyzes state transitions, and builds reusable memory and
          abstractions—so it can infer hidden mechanics, learn what actions mean,
          and eventually support world-model reasoning and scientific
          experimentation workflows.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/ilakkmanoharan/asra"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href="https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Kaggle ARC Prize 2026 (ARC-AGI-3)
          </a>
          <Link
            href="/nfm"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Nature Foundation Models
          </Link>
          <Link
            href="/hackathons"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Hackathon card
          </Link>
        </div>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Papers (PDF)
              </CardTitle>
              <CardDescription>
                Decision Biology specialization and architecture framing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {asraPapers.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  {p.title}
                </a>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                What ASRA focuses on
              </CardTitle>
              <CardDescription>
                The first steps toward adaptive scientific intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <ul className="list-inside list-disc space-y-2">
                <li>
                  <span className="font-medium text-foreground">
                    Action semantics inference
                  </span>
                  : learn what an action does via experimentation + transition
                  analysis (not predefined labels).
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Experiential memory
                  </span>
                  : log state → action → next_state + diffs for replay and
                  dataset export.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Explanatory world models
                  </span>
                  : aim for mechanistic understanding and uncertainty reduction,
                  not only prediction.
                </li>
                <li>
                  <span className="font-medium text-foreground">
                    Decision Biology
                  </span>
                  : interpret perturbations as interventions and signaling
                  pathways as latent biological world models.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            YouTube videos
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Walkthroughs and explainers on action semantics, replay/memory, and
            the Decision Biology / Nature Foundation Models stack.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {asraVideos.map((v) => (
              <Card key={v.youtubeUrl} className="border-border/80">
                <CardHeader>
                  <CardTitle className="font-heading text-base leading-snug">
                    {v.title}
                  </CardTitle>
                  <CardDescription>{v.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <a
                    href={v.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    Watch on YouTube
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

