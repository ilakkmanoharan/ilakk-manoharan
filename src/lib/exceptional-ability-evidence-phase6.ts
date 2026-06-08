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

/** Evidence 8 — ASRA Phase 6 Planning & Strategy Invention (ARC-AGI-3). */
export const asraPhase6EvidenceSection: ExceptionalAbilitySection = {
  number: 8,
  title: "ASRA Phase 6 - ARC-AGI-3: Planning & Strategy Invention",
  paragraphs: [
    "After Phase 5 infers what the environment is trying to achieve, ASRA Phase 6 adds the Planning & Strategy Invention layer: BFS and A* planners over observed transition graphs, MCTS-lite rollouts when graphs are sparse, a reusable strategy library mapping goal templates to operator sequences, a meta-controller for explore-exploit balance, and reset and plan repair mechanisms for recovery—deployed as `asra-v0.8-phase6`.",
    "Phase 6 answers: Given a leading goal hypothesis, what sequence of actions should we execute—and when should we abandon the plan? Without Phase 6, an agent with goal beliefs still selects actions myopically; human problem-solving in unknown environments—and biological experiment design—requires sequencing: reach before collect, unlock before traverse, transform before match.",
    "I specified and implemented the compact `PlanningEngine` atop Phase 5's `GoalHypothesisEngine` in the Kaggle agent, with the full research stack specified for `asra-arc/src/asra/planning/`. Theory, specification, implementation reference, kernel metadata, and CLI submit live in `kaggle-notebooks/phase6/` with the same folder parity as Phases 1–5 and 7–9.",
    "Contribution: Extends ASRA from goal inference to multi-step planning—strategy libraries, graph search, meta-control, and plan repair integrated with Phases 1–5 in the competition agent.",
    "Why this supports exceptional ability: Demonstrates sustained original work across six ASRA layers—combining theory, planning algorithms under competition latency constraints, and deployment as Milestone #2: an agent that plans, not only scores single actions.",
  ],
  bullets: [
    "Phases 1–5 → Phase 6 Planning & Strategy Invention → Phase 7 Robustness → Phases 8–9 (Decision Biology, integration)",
    "Agent asra-v0.8-phase6: BFS/A*, strategy library, meta-controller, plan repair in combined Phase 1–6 scoring",
    "Kaggle notebook: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase6/asra-phase-6-arc-prize-2026.ipynb",
    "Conceptual article: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase6/asra-phase6-planning-strategy-invention.md",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA Phase 6 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase6/asra-phase-6-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 6 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-6-arc-prize-2026",
    },
    {
      label: "Phase 6 conceptual article (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase6/asra-phase6-planning-strategy-invention.md",
    },
    {
      label: "Phase 6 folder (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks/phase6",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#planning", "#strategy"],
};
