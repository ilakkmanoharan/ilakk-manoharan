import type { ExceptionalAbilitySection } from "@/lib/exceptional-ability";

const portfolioNavLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Startup catalog", href: "/startups" },
];

function withPortfolioLinks(links: { label: string; href: string }[]) {
  const seen = new Set(links.map((l) => l.href));
  return [...links, ...portfolioNavLinks.filter((l) => !seen.has(l.href))];
}

/** Evidence 3 — ASRA Phase 1 Experience Engine (ARC-AGI-3). */
export const asraPhase1EvidenceSection: ExceptionalAbilitySection = {
  number: 3,
  title: "ASRA Phase 1 - ARC-AGI-3: Experience Engine",
  paragraphs: [
    "ASRA Phase 1 establishes the Experience Engine—the empirical substrate every later phase depends on. When action labels and environment rules are hidden, the agent cannot begin with predefined policies. Phase 1 treats every intervention as an experiment: observe grid state, apply an action token, log `(state, action, next_state, reward)` transitions, hash states for identity, infer coarse action semantics from cell-level diffs, and explore under uncertainty while tabooing empirically dead ends.",
    "Phase 1 answers the first scientific question in the nine-phase stack: What happened when we acted, and how can we use that evidence to choose the next intervention? Without this layer, object detectors have no consecutive frames, causal models have no logged effects, and planners have no edge tables.",
    "I designed Phase 1 theory (transition-centric adaptive reasoning, state-conditioned semantics inference, information-directed exploration, execution fidelity with isolated competition venv), implemented the research stack in asra-arc (`env/`, `memory/`, `agent/`), and brought Phase 1 to full parity with Phases 2–9: a dedicated `kaggle-notebooks/phase1/` folder with conceptual article, specification, implementation reference, kernel metadata, CLI submit tooling, and the canonical notebook `asra-phase-1-arc-prize-2026.ipynb` (agent tag `asra-v0.1-phase1`).",
    "Ilakkuvaselvi Manoharan (2026). [Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments](https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1) (Version 2.0). Article, SciLayer Systems (preprint).",
    "Contribution: Specifies a minimal, auditable agent architecture for environments where action meaning and rules are hidden—the reproducible interaction-to-knowledge pipeline that Phases 2–9 extend.",
    "Why this supports exceptional ability: Demonstrates original foundational architecture work with competition-grade deployment discipline—Phase 1 is not a placeholder baseline but the named start of a nine-layer program with folder, kernel, and scholarly parity across every phase.",
  ],
  bullets: [
    "Phase 1 Experience Engine → Phase 2 Observation → Phase 3 Navigation → Phases 4–9 (causality, goals, planning, robustness, Decision Biology, integration)",
    "Kaggle kernel: https://www.kaggle.com/code/ilakkmanoharan/asra-phase-1-arc-prize-2026",
    "Kaggle notebook (ASRA repo): https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase1/asra-phase-1-arc-prize-2026.ipynb",
    "Conceptual article (ASRA repo): https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase1/asra-phase1-transition-centric-experience.md",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASRA Phase 1 article",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
    },
    {
      label: "ASRA Phase 1 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase1/asra-phase-1-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 1 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-1-arc-prize-2026",
    },
    {
      label: "Phase 1 folder (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks/phase1",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#worldmodels", "#scilayer"],
};
