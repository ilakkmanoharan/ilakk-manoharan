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

/** Evidence 11 — ASRA Phase 9 Final Integration & Research Story (ARC-AGI-3). */
export const asraPhase9EvidenceSection: ExceptionalAbilitySection = {
  number: 11,
  title: "ASRA Phase 9 - Final Integration & Research Story",
  paragraphs: [
    "Phases 1–8 constructed a nine-layer cognitive stack—each phase answering a distinct scientific question, each producing an agent version, specification, conceptual article, and Kaggle notebook with full folder parity. ASRA Phase 9 is integration and narrative, not a new cognitive layer: it selects tuned weights from Phase 7, composes the full embedded stack into `asra-v1.0-phase9`, submits the final ARC Prize 2026 agent, and packages the research story—architecture diagram, evaluation report, demo video, GitHub README, and Decision Biology extension section.",
    "Phase 9 asks: Can we present the answers coherently? The merit of the ASRA program is not any single phase in isolation—it is the cumulative stack where each layer depends on the empirical substrate below it, each ships as open theory plus competition deployment, and the same architecture bridges ARC grid worlds to Decision Biology.",
    "I specified integration deliverables in `kaggle-notebooks/phase9/`—final submission spec, research story article, notebook builder, kernel metadata, and CLI submit—completing the nine-phase roadmap from `asra-v0.1-phase1` through `asra-v1.0-phase9` with one research narrative for competition judges, open-source collaborators, and the Nature Foundation Models program.",
    "Contribution: Unifies nine phases into a single legible research program—best ARC agent, full architecture narrative, evaluation report, and Decision Biology demo as one coherent story.",
    "Why this supports exceptional ability: Demonstrates sustained, end-to-end original research program execution—nine versioned agents, nine Kaggle notebooks, SciLayer preprints for Phases 1–4, conceptual articles for all phases, and explicit domain transfer to decision biology—at a scope and coherence rare for solo-authored work.",
  ],
  bullets: [
    "Nine-phase stack complete: Experience → Observation → Navigation → Causality → Goals → Planning → Robustness → Decision Biology → Integration",
    "Final agent asra-v1.0-phase9: full Phase 1–7 stack + Phase 8 bridge identity + Phase 7 tuned weights",
    "Kaggle notebook: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase9/asra-phase-9-arc-prize-2026.ipynb",
    "Research story: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase9/asra-phase9-final-research-story.md",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA Phase 9 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase9/asra-phase-9-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 9 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-9-arc-prize-2026",
    },
    {
      label: "Phase 9 research story (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase9/asra-phase9-final-research-story.md",
    },
    {
      label: "All Kaggle notebooks (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "SciLayer — ASRA corpus",
      href: "https://sci-layer.vercel.app",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#NFM", "#research"],
};
