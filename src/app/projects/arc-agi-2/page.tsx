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

export const metadata: Metadata = {
  title: "ARC-AGI-2 Research",
  description:
    "Neuro-symbolic adaptive reasoning for ARC Prize 2026 (ARC-AGI-2): learn world dynamics through intervention, represent mechanisms explicitly, and plan under uncertainty.",
};

const KAGGLE =
  "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-2";
const GITHUB = "https://github.com/ilakkmanoharan/ARC-AGI-2-Research";
const KERNEL =
  "https://www.kaggle.com/code/ilakkmanoharan/arc-agi-2-asra-v0-1-offline-dsl";

const PILLARS = [
  {
    title: "Learn world dynamics through intervention",
    body: "Treat each train pair as a transition journal. Infer object relations, residuals, and task signatures, then probe the search space with residual-guided experiments instead of open-ended guessing.",
  },
  {
    title: "Represent discovered mechanisms explicitly",
    body: "Induce short, falsifiable programs over an object-relational vocabulary. Prefer parameterized schemas with inferred arguments over one-off ops that only ever fire on a single known task.",
  },
  {
    title: "Plan actions under uncertainty",
    body: "Keep competing hypotheses when ambiguity remains, emit two diverse attempts per test output, and spend beam budget where information gain is highest — especially the large mass of tasks with no exact program yet.",
  },
] as const;

const STATUS = [
  {
    label: "Public eval gate (recent)",
    value: "8 / 120",
    note: "Families rose 1 → 4 → 6 → 8; ratio ≈ 1.00 until transfer improves",
  },
  {
    label: "Training gate (recent)",
    value: "~4.7%",
    note: "Training % is a weak proxy for eval / hidden test",
  },
  {
    label: "Kaggle publicScore",
    value: "0.00",
    note: "Expected while generalization ratio stays at 1.00",
  },
  {
    label: "Architecture",
    value: "ASRA-2",
    note: "Adopted Sep 2026 — transfer over memorisation",
  },
] as const;

export default function ArcAgi2ProjectPage() {
  return (
    <>
      <ViewTracker
        path="/projects/arc-agi-2"
        resourceType="project"
        resourceSlug="arc-agi-2-research"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">Kaggle</Badge>
          <Badge variant="secondary">ASRA-2</Badge>
          <Badge variant="secondary">Neuro-symbolic</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ARC-AGI-2 Research
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Adaptive program induction for{" "}
          <a
            href={KAGGLE}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            ARC Prize 2026 — ARC-AGI-2
          </a>
          . The system must invent skills for tasks it has never seen — not
          memorize public-eval families.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href={KAGGLE}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Kaggle competition
          </a>
          <a
            href={KERNEL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Offline DSL kernel
          </a>
          <Link href="/asra" className="text-primary hover:underline">
            ASRA
          </Link>
          <Link
            href="/projects/arc-agi-3"
            className="text-primary hover:underline"
          >
            ARC-AGI-3 research
          </Link>
          <Link href="/projects" className="text-primary hover:underline">
            All projects
          </Link>
        </div>

        <section className="mt-12" aria-labelledby="approach-heading">
          <h2
            id="approach-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Recent approach
          </h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            A neuro-symbolic adaptive reasoning model that learns world dynamics
            through intervention, represents discovered mechanisms explicitly,
            and plans actions under uncertainty.
          </p>
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                ASRA-2 architecture
              </CardTitle>
              <CardDescription>
                Adaptive neuro-symbolic reasoning: task-specific world models,
                experiments under uncertainty, and transferable scientific
                process — not hand-carved 1:1 ops.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Research chain:{" "}
                <span className="font-medium text-foreground">
                  transition → executable mechanism → falsification → shortest
                  program → uncertainty → decision
                </span>
                . Primary submit bar: raise{" "}
                <span className="font-medium text-foreground">
                  generalization ratio
                </span>{" "}
                (tasks solved / distinct families) above 1.0 without new
                task-specific operators.
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {PILLARS.map((p) => (
              <Card key={p.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {p.body}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="status-heading">
          <h2
            id="status-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Status at a glance
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Snapshot from the Sep 2026 research log (offline gates + Kaggle
            public score).
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS.map((s) => (
              <Card key={s.label}>
                <CardHeader className="pb-2">
                  <CardDescription>{s.label}</CardDescription>
                  <CardTitle className="font-heading text-2xl">
                    {s.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  {s.note}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="why-heading">
          <h2
            id="why-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Why this direction
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              Early versions raised the public-eval gate by carving specialized
              DSL ops. Gate movement without transfer left{" "}
              <span className="font-medium text-foreground">publicScore 0.00</span>{" "}
              — each family explained roughly one known eval task, so the hidden
              test shared almost nothing.
            </p>
            <p>
              Measured generic routes (inferred schemas, depth-1/2 whole-grid
              composition) scored on training and{" "}
              <span className="font-medium text-foreground">
                exactly zero on evaluation
              </span>
              . The unit that works looks like a small world model: multi-step
              programs over object relations with parameters inferred from train
              pairs — not shallow whole-grid search.
            </p>
            <p>
              The solver lives in an offline-safe Python harness (
              <code className="text-xs">solver/</code>
              ): analyzer journal, DSL beam search, two diverse attempts per
              test output, and Kaggle notebook submit without internet.
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="stack-heading">
          <h2
            id="stack-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Stack & artifacts
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Competition:{" "}
              <a
                href={KAGGLE}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                ARC Prize 2026 — ARC-AGI-2
              </a>
            </li>
            <li>
              Repo:{" "}
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                ilakkmanoharan/ARC-AGI-2-Research
              </a>
            </li>
            <li>
              Related interactive loop:{" "}
              <Link
                href="/projects/arc-agi-3"
                className="text-primary hover:underline"
              >
                ARC-AGI-3 Research Agent
              </Link>
            </li>
            <li>
              Reasoning stack:{" "}
              <Link href="/asra" className="text-primary hover:underline">
                ASRA
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
