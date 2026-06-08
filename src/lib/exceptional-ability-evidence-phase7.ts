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

/** Evidence 9 — ASRA Phase 7 Robustness & Generalization (ARC-AGI-3). */
export const asraPhase7EvidenceSection: ExceptionalAbilitySection = {
  number: 9,
  title: "ASRA Phase 7 - ARC-AGI-3: Robustness & Generalization",
  paragraphs: [
    "After Phase 6 adds goal-conditioned planning, ASRA Phase 7 optimizes reliability—not just capability. Phase 6 asks whether the agent can plan toward inferred objectives; Phase 7 asks whether that capability persists across unseen layouts, long horizons, and memory–perception mismatch. I designed the Robustness & Generalization layer: failure analyzer clustering dead-ends and wrong-goal episodes, generalization benchmarks across Procgen and DMLab, memory mismatch detection, planner stuck-loop detection, action waste reduction, and a consolidated evaluation dashboard—deployed as `asra-v0.85-phase7`.",
    "Competition agents that plan well on familiar state graphs often collapse under procedural variation: Procgen layout shifts break memorized BFS paths; long episodes trigger stuck loops; stale visitation memory misleads the meta-controller. Phase 7 makes these failure modes measurable and interruptible before wasting the action budget.",
    "I specified and implemented the compact `RobustnessEngine` wrapping Phase 6's `PlanningEngine` in the Kaggle agent, with the research library specified for `asra-arc/src/asra/robustness/`. Full folder parity in `kaggle-notebooks/phase7/`—conceptual article, specification, notebook, kernel metadata, and CLI submit.",
    "Contribution: Extends ASRA from planning capability to cross-layout reliability—failure diagnosis, stuck detection, and generalization evaluation preparing the final candidate agent before Phase 9 integration.",
    "Why this supports exceptional ability: Demonstrates systems-level rigor across seven ASRA layers—combining theory, multi-environment generalization benchmarks, and competition-scale deployment with explicit failure-mode engineering rare in research competition entries.",
  ],
  bullets: [
    "Phases 1–6 cognitive + planning stack → Phase 7 Robustness → Phase 8 Decision Biology → Phase 9 integration",
    "Agent asra-v0.85-phase7: failure analyzer, stuck detector, action waste reducer wrapping Phase 1–6 stack",
    "Kaggle notebook: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase7/asra-phase-7-arc-prize-2026.ipynb",
    "Conceptual article: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase7/asra-phase7-robustness-generalization.md",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA Phase 7 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase7/asra-phase-7-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 7 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-7-arc-prize-2026",
    },
    {
      label: "Phase 7 conceptual article (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase7/asra-phase7-robustness-generalization.md",
    },
    {
      label: "Phase 7 folder (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks/phase7",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#robustness", "#generalization"],
};
