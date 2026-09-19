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
  title: "ASRA-NFM",
  description:
    "Neuro-symbolic adaptive reasoning: learn world dynamics through intervention, represent mechanisms explicitly, and plan under uncertainty.",
};

const GITHUB = "https://github.com/ilakkmanoharan/asra-nfm";

const PILLARS = [
  {
    title: "Learn through intervention",
    body: "Actions are scientific probes. The core evidence unit is the transition (state, action, next-state) and its residual change — not passive next-token prediction alone.",
  },
  {
    title: "Represent mechanisms explicitly",
    body: "Object-centric states and symbolic rules sit beside neural predictors so discovered regularities stay inspectable, revisable, and transferable across tasks.",
  },
  {
    title: "Plan under uncertainty",
    body: "Competing hypotheses stay alive until experiments discriminate them. Actions balance goal progress against information gain, risk, and cost.",
  },
] as const;

const CONCEPTS = [
  {
    name: "Neuro-symbolic learning",
    why: "Neural perception discovers structure; symbolic layers hold objects, relations, rules, and inferences.",
  },
  {
    name: "Object-centric states",
    why: "States are entities with properties, relations, and constraints — not only raw grids.",
  },
  {
    name: "Transition world models",
    why: "Learn and predict (s_t, a_t, s_{t+1}) dynamics from repeated interventions.",
  },
  {
    name: "Action-semantics discovery",
    why: "Infer what action IDs mean via before/after diffs: syntax vs semantics vs mechanism vs utility.",
  },
  {
    name: "Causal world models",
    why: "Prefer do()-style interventions over correlations when explaining outcomes.",
  },
  {
    name: "Hypothesis testing loop",
    why: "Propose → predict → intervene → observe → retain or reject competing explanations.",
  },
] as const;

const MATERIALS = [
  {
    title: "Concepts paper (Markdown)",
    desc: "Implementation concepts: neuro-symbolic learning, transitions, causal models, planning, memory, and autonomous ML experiments.",
    href: "/asra-nfm/paper/paper1.md",
    kind: "Paper",
  },
  {
    title: "Poster — 16:9 (PDF)",
    desc: "Digital research poster for screens and shareable handouts.",
    href: "/asra-nfm/posters/asra-nfm-poster-16x9.pdf",
    kind: "Poster",
  },
  {
    title: "Poster — 16:9 (HTML)",
    desc: "Editable interactive layout of the 16:9 poster.",
    href: "/asra-nfm/posters/asra-nfm-poster-16x9.html",
    kind: "Poster",
  },
  {
    title: "Poster — 36×48 in (PDF)",
    desc: "Print-oriented landscape exhibition poster.",
    href: "/asra-nfm/posters/asra-nfm-poster-36x48.pdf",
    kind: "Poster",
  },
  {
    title: "Poster — 36×48 in (HTML)",
    desc: "Editable HTML source for the large-format poster.",
    href: "/asra-nfm/posters/asra-nfm-poster-36x48.html",
    kind: "Poster",
  },
  {
    title: "Presentation slides (PDF)",
    desc: "Theory deck export for talks and reviews.",
    href: "/asra-nfm/presentation/asra-nfm-slides.pdf",
    kind: "Presentation",
  },
  {
    title: "Presentation slides (HTML)",
    desc: "Interactive 17-slide deck (arrow keys / on-screen controls).",
    href: "/asra-nfm/presentation/asra-nfm-slides.html",
    kind: "Presentation",
  },
  {
    title: "150-word abstract",
    desc: "Poster abstract stating the central claim as a hypothesis pending measured validation.",
    href: "/asra-nfm/posters/abstract.md",
    kind: "Poster",
  },
] as const;

const PHASES = [
  { n: "1–3", label: "Schemas → symbolic models → metacognitive agents" },
  { n: "4", label: "Neural + hybrid world models and comparative eval" },
  { n: "5", label: "ARC-AGI-3 mock + Toolkit adapters, budgets, replay" },
  { n: "6", label: "Planned — broader NFM / physical AI transfer" },
] as const;

export default function AsraNfmProjectPage() {
  return (
    <>
      <ViewTracker
        path="/projects/asra-nfm"
        resourceType="project"
        resourceSlug="asra-nfm"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Active</Badge>
          <Badge variant="secondary">Neuro-symbolic</Badge>
          <Badge variant="secondary">ASRA</Badge>
          <Badge variant="secondary">NFM</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          ASRA-NFM
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Adaptive Scientific Reasoning Architecture for Nature Foundation
          Models — a neuro-symbolic system that learns world dynamics through
          intervention, represents discovered mechanisms explicitly, and plans
          actions under uncertainty.
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
            href="/asra-nfm/paper/paper1.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Paper concepts
          </a>
          <a
            href="/asra-nfm/posters/asra-nfm-poster-16x9.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Poster PDF
          </a>
          <a
            href="/asra-nfm/presentation/asra-nfm-slides.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="size-4" aria-hidden />
            Slides
          </a>
          <Link href="/asra" className="text-primary hover:underline">
            ASRA
          </Link>
          <Link href="/projects/arc-agi-2" className="text-primary hover:underline">
            ARC-AGI-2
          </Link>
          <Link href="/projects/arc-agi-3" className="text-primary hover:underline">
            ARC-AGI-3
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
            Approach
          </h2>
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Central research question
              </CardTitle>
              <CardDescription>
                Can an agent learn unfamiliar environments efficiently by
                treating actions as scientific interventions, maintaining
                competing explanations, and explicitly modeling the mechanisms
                that produce observed changes?
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Foundational evidence unit:{" "}
              <span className="font-medium text-foreground">
                T<sub>t</sub> = (s<sub>t</sub>, a<sub>t</sub>, s<sub>t+1</sub>)
              </span>{" "}
              with residual{" "}
              <span className="font-medium text-foreground">
                Δ<sub>t</sub> = Diff(s<sub>t</sub>, s<sub>t+1</sub>)
              </span>
              . Functional roles: Tabby (questions), Grubby (evidence), Sam
              (decisions).
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

        <section className="mt-12" aria-labelledby="arch-heading">
          <h2
            id="arch-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Architecture
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Observation → object-centric state → intervention → transition
            analysis → competing hypotheses → neural + symbolic world model →
            information-gain or goal-directed planning → next action.
          </p>
          <Card className="mt-6 overflow-hidden">
            <CardContent className="pt-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/asra-nfm/assets/architecture.svg"
                alt="ASRA-NFM architecture flowchart"
                className="mx-auto w-full max-w-3xl"
              />
            </CardContent>
          </Card>
        </section>

        <section className="mt-12" aria-labelledby="concepts-heading">
          <h2
            id="concepts-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Paper concepts
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Highlights from the implementation concepts write-up. Full markdown:{" "}
            <a
              href="/asra-nfm/paper/paper1.md"
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              paper1.md
            </a>
            .
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {CONCEPTS.map((c) => (
              <Card key={c.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="font-heading text-base">
                    {c.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {c.why}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="materials-heading">
          <h2
            id="materials-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Paper, posters &amp; presentation
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Theory pack for collaborators and talks. Measured scores stay
            placeholders until controlled evaluations are published.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {MATERIALS.map((m) => (
              <Card key={m.href}>
                <CardHeader className="pb-2">
                  <CardDescription>{m.kind}</CardDescription>
                  <CardTitle className="font-heading text-base">
                    <a
                      href={m.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                    >
                      {m.title}
                      <ExternalLink className="size-3.5" aria-hidden />
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {m.desc}
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
            Implementation status
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PHASES.map((p) => (
              <Card key={p.n}>
                <CardHeader className="pb-2">
                  <CardDescription>Phase {p.n}</CardDescription>
                  <CardTitle className="text-base font-medium leading-snug">
                    {p.label}
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Repo demos cover synthetic hard envs and ARC Toolkit paths (
            <code className="text-xs">make demo-phase5-sdk</code>
            ). Competition submits default to prepare-only.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="links-heading">
          <h2
            id="links-heading"
            className="font-heading text-2xl font-semibold tracking-tight"
          >
            Related
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Code:{" "}
              <a
                href={GITHUB}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                github.com/ilakkmanoharan/asra-nfm
              </a>
            </li>
            <li>
              Parent architecture:{" "}
              <Link href="/asra" className="text-primary hover:underline">
                ASRA
              </Link>
            </li>
            <li>
              Applied solvers:{" "}
              <Link
                href="/projects/arc-agi-2"
                className="text-primary hover:underline"
              >
                ARC-AGI-2
              </Link>
              ,{" "}
              <Link
                href="/projects/arc-agi-3"
                className="text-primary hover:underline"
              >
                ARC-AGI-3
              </Link>
            </li>
            <li>
              LoRA corpora:{" "}
              <Link
                href="/projects/asra-lora"
                className="text-primary hover:underline"
              >
                ASRA-LoRA
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
