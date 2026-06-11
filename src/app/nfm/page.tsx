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
  atlasGsMetrics,
  nfmDevelopmentStages,
  nfmLinks,
  nfmPapers,
  nfmStackLayers,
} from "@/lib/nfm";

export const metadata: Metadata = {
  title: "Nature Foundation Models",
  description:
    "NFM research program: NFM-Worlds, NFM-Robotics, Atlas-GS Gaussian world models, and ASRA adaptive scientific reasoning—with SciLayer preprints and open implementations.",
};

function papersByCategory() {
  const map = new Map<string, typeof nfmPapers>();
  for (const paper of nfmPapers) {
    const list = map.get(paper.category) ?? [];
    list.push(paper);
    map.set(paper.category, list);
  }
  return [...map.entries()];
}

export default function NfmPage() {
  const paperGroups = papersByCategory();

  return (
    <>
      <ViewTracker path="/nfm" resourceType="page" resourceSlug="nfm" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Research program</Badge>
          <Badge variant="secondary">Scientific AI</Badge>
          <Badge variant="secondary">World models</Badge>
          <Badge variant="secondary">Embodied AI</Badge>
          <Badge variant="secondary">Decision Biology</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          Nature Foundation Models
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          <strong className="font-medium text-foreground">
            Learn the structure of reality through interaction.
          </strong>{" "}
          Nature Foundation Models (NFM) is a research program for building
          intelligent systems that learn persistent world models, action
          semantics, causal structure, and mechanisms from observation and
          intervention—not as disconnected modules, but as a single
          developmental arc from embodied experience to adaptive scientific
          reasoning.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <a
            href={nfmLinks.nfmGithub}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            NFM on GitHub
          </a>
          <a
            href={nfmLinks.asraGithub}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            ASRA on GitHub
          </a>
          <a
            href={nfmLinks.scilayer}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            SciLayer preprints
          </a>
          <Link
            href={nfmLinks.asraPage}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            ASRA page
          </Link>
          <Link
            href={nfmLinks.startupCatalog}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Startup catalog
          </Link>
          <a
            href={nfmLinks.decisionBiology}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Decision Biology
          </a>
        </div>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            The NFM stack
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            NFM organizes research as a hierarchy—from abstract scientific
            intelligence down to runnable code. Each layer has a clear role; each
            implementation proves the layer below without rewriting what came
            before.
          </p>
          <div className="mt-6 space-y-4">
            {nfmStackLayers.map((layer) => (
              <Card key={layer.name} className="border-border/80">
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="font-heading text-lg">
                      {layer.name}
                    </CardTitle>
                    <Badge variant="outline">{layer.status}</Badge>
                  </div>
                  <CardDescription>{layer.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {layer.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Core abstraction
              </CardTitle>
              <CardDescription>
                One interaction loop spans robotics, biology, chemistry, and
                ecology.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p className="font-mono text-foreground">
                State_t + Action_t → State_{"{t+1}"}
              </p>
              <p>
                A world is{" "}
                <span className="font-mono text-foreground">
                  (State, Dynamics, Actions, Observations)
                </span>
                . The learning objective is observation + action + feedback +
                time → knowledge—representations, dynamics, causal links, hidden
                mechanisms, and eventually theories.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                Seven-stage developmental pipeline
              </CardTitle>
              <CardDescription>
                Capabilities emerge in order—not as separate products glued
                together.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-inside list-decimal space-y-2 text-sm text-muted-foreground">
                {nfmDevelopmentStages.map((stage) => (
                  <li key={stage}>{stage}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Atlas-GS v1
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Atlas-GS is the first runnable implementation in the NFM stack. It
            turns RGB-D observations into persistent 3D Gaussian world models and
            runs the full observe → map → localize → remember → log loop—on TUM
            RGB-D benchmarks or synthetic scenes, without requiring a physical
            robot or GPU for v1 validation.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {atlasGsMetrics.map((m) => (
              <Card key={m.label} className="border-border/80">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{m.label}</CardDescription>
                  <CardTitle className="font-heading text-2xl">{m.value}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card className="mt-6 border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-xl">
                What Atlas-GS does (v1)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              <ul className="list-inside list-disc space-y-1">
                <li>RGB-D ingest (TUM, synthetic rooms)</li>
                <li>Gaussian world build and incremental merge</li>
                <li>Pose localization against the map (ICP)</li>
                <li>Scene memory — save/load world bundles</li>
              </ul>
              <ul className="list-inside list-disc space-y-1">
                <li>Transition logging — JSONL state–action–state records</li>
                <li>Demo videos — orbit and trajectory renders</li>
                <li>Modular Python package (<code>atlas_gs</code>)</li>
                <li>CPU-first design with GPU upgrade path documented</li>
              </ul>
            </CardContent>
          </Card>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <a
              href={`${nfmLinks.scilayer}/articles/atlas-gs-end-to-end-implementation`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden />
              Atlas-GS implementation paper (SciLayer)
            </a>
            <a
              href={nfmLinks.nfmGithub}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden />
              NFM-Robotics/Atlas/Atlas-GS on GitHub
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            ASRA — Adaptive Scientific Reasoning Architecture
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            ASRA is the adaptive reasoning layer of NFM—a nine-phase cognitive
            stack for learning action semantics, causal structure, goals,
            planning, and robustness from state transitions under uncertainty.
            The same architecture transfers from ARC grid worlds to Decision
            Biology perturbation–response reasoning.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              href={nfmLinks.asraPage}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              ASRA page (videos &amp; overview)
            </Link>
            <a
              href={nfmLinks.asraGithub}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden />
              ASRA on GitHub (Kaggle notebooks Phases 1–9)
            </a>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Publications (SciLayer)
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            All NFM and ASRA preprints are published on SciLayer with persistent
            URLs, open licensing, and version history.
          </p>

          <div className="mt-8 space-y-8">
            {paperGroups.map(([category, papers]) => (
              <div key={category}>
                <h3 className="font-heading text-lg font-semibold">{category}</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {papers.map((p) => (
                    <li key={p.href}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-1 text-primary hover:underline"
                      >
                        <ExternalLink
                          className="mt-0.5 size-4 shrink-0"
                          aria-hidden
                        />
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            NFM-Worlds &amp; NFM-Robotics
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">NFM-Worlds</strong>{" "}
            is the shared brain—world state schemas, dynamics APIs, and
            transition abstractions that generalize across domains.{" "}
            <strong className="font-medium text-foreground">NFM-Robotics</strong>{" "}
            is the body—sensor middleware, calibration hooks, and sim-first
            development that ground models in physical interaction. Atlas-GS v1
            implements world-state and transitions locally today; as the stack
            matures, shared abstractions migrate upward into NFM-Worlds and
            NFM-Robotics without architectural rework.
          </p>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground">
            Future branches—NFM-Biology, NFM-Chemistry, NFM-Ecology—and sibling
            Atlas projects (Atlas-NeRF, Atlas-Sim, Atlas-Bio) extend the same
            core ideas. Phase 1 of the startup wedge is{" "}
            <a
              href={nfmLinks.decisionBiology}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Decision Biology
            </a>
            : cells as probabilistic decision systems governed by information
            flow, energy constraints, and stochastic dynamics.
          </p>
        </section>
      </div>
    </>
  );
}
