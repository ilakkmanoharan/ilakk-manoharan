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

/** Evidence 7 — ASRA Phase 5 Goal Inference & Hypothesis Engine (ARC-AGI-3). */
export const asraPhase5EvidenceSection: ExceptionalAbilitySection = {
  number: 7,
  title: "ASRA Phase 5 - ARC-AGI-3: Goal Inference & Hypothesis Engine",
  paragraphs: [
    "After Phases 1–4 established transitions, object-centric observation, directed exploration, and causal action semantics, I designed ASRA Phase 5, the Goal Inference & Hypothesis Engine: a stack that generates win-condition hypotheses from scene structure and semantic operators, detects progress signals from sparse rewards and structural change, classifies object roles (agent, target, token, hazard, key, door), ranks competing goal explanations, and plans discriminating experiments using Phase 4 uncertainty and counterfactuals—deployed in the competition agent as `asra-v0.7-phase5`.",
    "Phase 5 answers the pivot question: What is this system trying to achieve? Which hidden objective best explains the progress we have seen? What experiment should we run next to distinguish competing explanations? Without Phase 5, an agent that understands interventions still acts without purpose—it knows ACTION3 translates an object but not whether translation serves collection, pattern matching, or hazard avoidance.",
    "I specified and implemented the compact `GoalHypothesisEngine` in the Kaggle agent (goal templates for move, match, collect, unlock, avoid, transform; progress detector; hypothesis ranker; experiment planner), with the full research engine specified for `asra-arc/src/asra/goals/`. Conceptual theory is documented in `asra-phase5-goal-inference-hypothesis-engine.md` alongside kernel metadata and CLI submit tooling—full folder parity with Phases 1–4 and 6–9.",
    "Contribution: Extends ASRA from intervention reasoning to scientific objective inference—win-condition hypotheses, progress signals, object roles, and goal-discriminating experiments integrated with Phase 4 causal semantics.",
    "Why this supports exceptional ability: Demonstrates sustained original work across five ASRA layers—moving from what actions do to what success requires, with theory, open specification, and competition-scale deployment in a single named architecture program.",
  ],
  bullets: [
    "Phases 1–4 cognitive core → Phase 5 Goal Inference → Phase 6 Planning → Phases 7–9 (robustness, Decision Biology, integration)",
    "Agent asra-v0.7-phase5: goal templates, progress signals, hypothesis ranking wired into combined Phase 1–5 scoring",
    "Kaggle notebook: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase5/asra-phase-5-arc-prize-2026.ipynb",
    "Conceptual article: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase5/asra-phase5-goal-inference-hypothesis-engine.md",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA Phase 5 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase5/asra-phase-5-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 5 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-5-arc-prize-2026",
    },
    {
      label: "Phase 5 conceptual article (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase5/asra-phase5-goal-inference-hypothesis-engine.md",
    },
    {
      label: "Phase 5 folder (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks/phase5",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ASRA Phase 4 (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/causal-action-semantics-asra-phase-4",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#hypothesis", "#goals"],
};
