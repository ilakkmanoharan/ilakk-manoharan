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

/** Evidence 4 — ASRA Phase 3 Navigation & Memory Engine (ARC-AGI-3). */
export const asraPhase3EvidenceSection: ExceptionalAbilitySection = {
  number: 4,
  title: "ASRA Phase 3 - ARC-AGI-3: Navigation & Memory Engine",
  paragraphs: [
    "After ASRA Phase 1 (transition-centric experience under hidden action semantics) and Phase 2 (object-centric observation and rule hypotheses), I designed and implemented ASRA Phase 3, the Navigation & Memory Engine: a stack that turns episodic transitions into exploration graphs, visitation memory, novelty versus usefulness scoring, compositional subgoals, strategy reuse, and transition replay—then deploys compact exploration hints alongside Phase 2 object-scene bias in the ARC Prize 2026 competition agent (asra-v0.5-phase3).",
    "Phase 3 answers a question neither Phase 1 nor Phase 2 can alone: Where have I been? What territory remains unexplored? Which action opens new ground instead of repeating a loop? What intermediate goal am I pursuing?",
    "I designed Phase 3 theory (exploration graphs with frontier scores, dual-key visitation memory, novelty/usefulness separation, subgoal inference, strategy libraries, and integration with Phases 1–2 without oracle maps), implemented Milestones 3A–3D in asra-arc/src/asra/exploration/ (exploration engine, memory system, subgoal module, MiniGrid/BabyAI runners, DoorKey benchmarks, and ARC-AGI-3 ablation tooling), validated on MiniGrid (coverage, revisit rate, frontier efficiency) and BabyAI (subgoal detection), and deployed the Kaggle notebook with isolated venv bootstrap and combined Phase 1 + Phase 2 + Phase 3 scoring.",
    "Ilakkuvaselvi Manoharan (2026). [Directed Exploration and Episodic Memory: ASRA Phase 3 — From Structure to Navigation](https://sci-layer.vercel.app/articles/directed-exploration-episodic-memory-asra-phase-3). Article, SciLayer Systems (preprint). [Technical specification](https://sci-layer.vercel.app/articles/asra-phase-3-exploration-memory-navigation-spec).",
    "Contribution: Extends ASRA from structure perception to directed exploration—exploration graphs with frontiers, exact hash plus object-fingerprint visitation keys, novelty and usefulness decomposition, BabyAI-style subgoal inference, strategy reuse, and transition replay integrated with Phase 1 transitions and Phase 2 object hints in the competition agent.",
    "Why this supports exceptional ability: Demonstrates sustained original work across three ASRA layers—experience, observation, and navigation—combining theory, multi-environment evaluation infrastructure (MiniGrid, BabyAI, ARC ablations), open-source implementation, and competition-scale deployment within a single named architecture program.",
  ],
  bullets: [
    "Phase 1 Experience Engine → Phase 2 Observation Engine → Phase 3 Navigation & Memory Engine → planned causality, goals, and planning phases",
    "Exploration library: https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/exploration",
    "Milestones 3A–3D: MiniGrid foundation, useful exploration (DoorKey), BabyAI subgoals, ARC-AGI-3 integration (asra-v0.5-phase3)",
    "Kaggle notebook (ASRA repo): https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase3/asra-phase-3-arc-prize-2026.ipynb",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASRA Phase 3 (conceptual)",
      href: "https://sci-layer.vercel.app/articles/directed-exploration-episodic-memory-asra-phase-3",
    },
    {
      label: "SciLayer — ASRA Phase 3 (technical specification)",
      href: "https://sci-layer.vercel.app/articles/asra-phase-3-exploration-memory-navigation-spec",
    },
    {
      label: "ASRA Phase 3 Kaggle notebook (ASRA GitHub)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase3/asra-phase-3-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA exploration library",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/exploration",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ASRA Phase 2 (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/object-centric-adaptive-reasoning-asra-phase-2",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#exploration", "#scilayer"],
};
