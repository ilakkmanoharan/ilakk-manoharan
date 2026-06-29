import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { NeurogolfLoraCharts } from "@/components/neurogolf-lora-charts";
import { NeurogolfSubmissionsTable } from "@/components/neurogolf-submissions-table";
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
  loadNeurogolfLoraStats,
  NEUROGOLF_GITHUB,
  NEUROGOLF_KAGGLE,
  NEUROGOLF_LORA_RESEARCH_REPO,
} from "@/lib/neurogolf-lora-research";

export const metadata: Metadata = {
  title: "ARC-NeuroGolf LoRA Research",
  description:
    "NeuroGolf 2026 Kaggle loop: score timeline, LoRA adapter training stats, and synthetic dataset growth for Agent 1.",
};

export default function ArcNeurogolfResearchPage() {
  const stats = loadNeurogolfLoraStats();

  return (
    <>
      <ViewTracker
        path="/projects/arc-neurogolf"
        resourceType="project"
        resourceSlug="arc-neurogolf"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">Kaggle</Badge>
          <Badge variant="secondary">LoRA</Badge>
          <Badge variant="secondary">GitHub Actions</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ARC-NeuroGolf Research
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Autonomous competition loop for{" "}
          <a
            href={NEUROGOLF_KAGGLE}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            NeuroGolf 2026
          </a>
          . LoRA adapters (Diagnose / Strategize / Implement) learn from scored
          submissions — goal:{" "}
          <strong className="text-foreground">increase Kaggle public score</strong>
          .
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={NEUROGOLF_GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            GitHub <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={NEUROGOLF_LORA_RESEARCH_REPO}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Repo research HTML <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <Link href="/projects" className="text-sm text-primary hover:underline">
            All projects
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Best Kaggle</CardDescription>
              <CardTitle className="text-3xl">{stats.best_kaggle ?? "—"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {stats.best_label ?? "Best scored submission"}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Best pass_all</CardDescription>
              <CardTitle className="text-3xl">{stats.best_pass_all ?? "—"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Verified tasks earning points
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Scored submissions</CardDescription>
              <CardTitle className="text-3xl">{stats.timeline.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Updated {new Date(stats.generated_at).toLocaleString()}
            </CardContent>
          </Card>
        </div>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold">Submissions</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Per-submission Kaggle score, pass_all, audit est, and links to analysis /
            plan / theory in the repo. Updated when{" "}
            <code className="rounded bg-muted px-1">update_lora_research_page.py</code> runs.
          </p>
          <div className="mt-4">
            <NeurogolfSubmissionsTable submissions={stats.submissions ?? []} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold">Progress charts</h2>
          <p className="mt-2 text-sm text-muted-foreground">{stats.note_arcgen}</p>
          <div className="mt-6">
            <NeurogolfLoraCharts stats={stats} />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold">LoRA adapters</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Base model: mlx-community/Llama-3.2-3B-Instruct-4bit. Synthetic rows
            are exported from submission analysis and plans — not generated by
            training itself.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="p-3">Adapter</th>
                  <th className="p-3">Examples</th>
                  <th className="p-3">MLX rows</th>
                  <th className="p-3">Checkpoint</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.adapters).map(([key, a]) => (
                  <tr key={key} className="border-b last:border-0">
                    <td className="p-3 font-medium">{a.display}</td>
                    <td className="p-3">{a.examples}</td>
                    <td className="p-3">{a.mlx_train_rows}</td>
                    <td className="p-3">{a.checkpoint ? "yes" : "no"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
