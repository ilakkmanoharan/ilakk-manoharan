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
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "ASRA-LoRA",
  description:
    "Synthetic reasoning datasets and Qwen2.5 LoRA pipeline for adaptive scientific reasoning on ARC and ASRA transition logs.",
};

const DATASETS = [
  { name: "Action effect", rows: "81,391", file: "D1" },
  { name: "Next action", rows: "70,342", file: "D2" },
  { name: "Failure revision", rows: "81,391", file: "D3" },
  { name: "Submit post-mortem", rows: "5", file: "D4" },
  { name: "ARC hypotheses", rows: "1,859", file: "D5" },
  { name: "ARC solutions", rows: "1,859", file: "D6" },
  { name: "Reasoning traces", rows: "5,400", file: "D7" },
];

const VIZ_LINKS = [
  {
    title: "Interactive dashboard",
    href: "/asra-lora/dashboard.html",
    desc: "Class balance, Kaggle scores, trace domains",
  },
  {
    title: "ARC gallery",
    href: "/asra-lora/arc-gallery.html",
    desc: "Before/after grids with synthetic hypotheses",
  },
  {
    title: "Kaggle score ladder",
    href: "/asra-lora/score-ladder.html",
    desc: "Phase 1–4 competition submit history",
  },
  {
    title: "Reasoning trace",
    href: "/asra-lora/reasoning-trace.html",
    desc: "Annotated Observation→Revision trajectory",
  },
  {
    title: "Training QA",
    href: "/asra-lora/training-qa.html",
    desc: "Oversampling weights, novelty scatter",
  },
  {
    title: "State graph",
    href: "/asra-lora/state-graph.html",
    desc: "Transition graph from ASRA logs",
  },
  {
    title: "Exploration graph",
    href: "/asra-lora/exploration-graph.html",
    desc: "Phase 3 usefulness-weighted frontiers",
  },
  {
    title: "Episode replay",
    href: "/asra-lora/episode-replay.html",
    desc: "Step-through replay + LoRA overlay slot",
  },
  {
    title: "LoRA adapter pipeline",
    href: "/asra-lora/adapter.html",
    desc: "Qwen2.5 SFT status and training commands",
  },
];

export default function AsraLoraProjectPage() {
  return (
    <>
      <ViewTracker
        path="/projects/asra-lora"
        resourceType="project"
        resourceSlug="asra-lora"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">LoRA</Badge>
          <Badge variant="secondary">ASRA</Badge>
          <Badge variant="secondary">ARC</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ASRA-LoRA
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Adaptive Scientific Reasoning through LoRA fine-tuning. Seven synthetic
          datasets (242K+ rows) teach Qwen2.5 models to reason via observation,
          hypothesis, exploration, failure, and revision—not answer memorization
          alone. Built on{" "}
          <Link href="/asra" className="text-primary hover:underline">
            ASRA
          </Link>{" "}
          transition logs, Kaggle submission archives, and Original ARC.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href="https://github.com/ilakkmanoharan/ASRA-LoRA"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            GitHub
          </a>
          <a
            href="/asra-lora/index.html"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Full dataset portfolio
          </a>
          <a
            href="https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            SciLayer paper
          </a>
          <Link href="/projects" className="text-primary hover:underline">
            All projects
          </Link>
          <Link
            href="/exceptional-ability"
            className="text-primary hover:underline"
          >
            Exceptional ability evidence
          </Link>
        </div>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total SFT rows</CardDescription>
              <CardTitle className="text-3xl">242,247</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Datasets</CardDescription>
              <CardTitle className="text-3xl">7</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Target model</CardDescription>
              <CardTitle className="text-lg">Qwen2.5-1.5B</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>First adapter</CardDescription>
              <CardTitle className="text-lg">HypothesisLoRA</CardTitle>
            </CardHeader>
          </Card>
        </section>

        <section className="mt-10" aria-labelledby="datasets-heading">
          <h2
            id="datasets-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Dataset inventory
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Regenerated with{" "}
            <code className="text-xs">python3 scripts/build_datasets.py</code>{" "}
            from local ASRA data.
          </p>
          <div className="mt-4 overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40 text-left">
                  <th className="p-3 font-medium">Dataset</th>
                  <th className="p-3 font-medium">Rows</th>
                  <th className="p-3 font-medium">LoRA module</th>
                </tr>
              </thead>
              <tbody>
                {DATASETS.map((d) => (
                  <tr key={d.file} className="border-b last:border-0">
                    <td className="p-3">{d.name}</td>
                    <td className="p-3 font-mono">{d.rows}</td>
                    <td className="p-3 text-muted-foreground">
                      {d.file === "D1" || d.file === "D5"
                        ? "HypothesisLoRA"
                        : d.file === "D2"
                          ? "ExplorationLoRA"
                          : d.file === "D3"
                            ? "FailureLoRA"
                            : d.file === "D7"
                              ? "TraceLoRA"
                              : "Meta / baseline"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="viz-heading">
          <h2
            id="viz-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Interactive visualizations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Static HTML + Chart.js — hosted on this portfolio (not GitHub Pages).
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VIZ_LINKS.map((v) => (
              <Card key={v.href} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-base">
                    <a href={v.href} className="hover:text-primary">
                      {v.title}
                    </a>
                  </CardTitle>
                  <CardDescription>{v.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="mt-6">
            <Button asChild>
              <a href="/asra-lora/dashboard.html">Open dashboard →</a>
            </Button>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="pipeline-heading">
          <h2
            id="pipeline-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            LoRA training pipeline
          </h2>
          <Card className="mt-4">
            <CardContent className="pt-6">
              <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs">
                {`pip install torch transformers peft trl datasets
python train/hypothesis_lora_sft.py --dataset dataset1_action_effect_v0.jsonl
# Integrate adapter into ASRA Kaggle agent (Phase 7 roadmap)`}
              </pre>
              <p className="mt-4 text-sm text-muted-foreground">
                LoRA modules plug into the competition{" "}
                <code className="text-xs">my_agent.py</code> loop—they do not
                replace the ARC-AGI-3 scoring agent. Hypothesis and
                action-effect heads augment ASRA transition-centric exploration.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
