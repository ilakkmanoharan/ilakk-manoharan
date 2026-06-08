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

/** Evidence 10 — ASRA Phase 8 Decision Biology Bridge (ARC-AGI-3). */
export const asraPhase8EvidenceSection: ExceptionalAbilitySection = {
  number: 10,
  title: "ASRA Phase 8 - Decision Biology Bridge",
  paragraphs: [
    "Phases 1–7 built and hardened a transition-centric cognitive stack for interactive grid environments. From Phase 4 onward, ASRA drew conceptual parallels to Decision Biology—intervention–response reasoning under latent objectives—but remained game-bound in implementation. ASRA Phase 8 makes that bridge operational: an isomorphic extension mapping environment states to cell states, game actions to perturbations, and goal hypotheses to pathway survival objectives—deployed as `asra-v0.9-phase8`.",
    "Phase 8 reuses Phase 1 transition schema, Phase 4 intervention semantics, Phase 5 hypothesis ranking, and Phase 6 experiment sequencing on biological datasets—LINCS L1000, OmniPath, scPerturb, Cell Painting, and Human Cell Atlas context. Without Phase 8, ASRA remains an ARC competition project. With Phase 8, it becomes a Nature Foundation Models narrative: one architecture for adaptive reasoning in unknown dynamical systems—whether those systems are grid worlds or living cells.",
    "I specified the Decision Biology bridge in `asra-arc/src/asra/decision_biology/`, documented theory in `asra-phase8-decision-biology-bridge.md`, and deployed the Kaggle agent with bridge identity in `kaggle-notebooks/phase8/`—full folder parity with Phases 1–7 and 9. The program-level SciLayer article [ASRA for Decision Biology](https://sci-layer.vercel.app/articles/asra-for-decision-biology) (also on SSRN) provides the scholarly foundation.",
    "Contribution: Extends ASRA from ARC grid worlds to perturbation–response reasoning in biological state spaces—the same transition loop, different domain.",
    "Why this supports exceptional ability: Demonstrates domain transfer of a named architecture from interactive benchmarks to decision biology—a mark of generalizable scientific contribution, not a disconnected competition entry.",
  ],
  bullets: [
    "Phases 1–7 (games) → Phase 8 Decision Biology bridge → Phase 9 unified research story",
    "Mapping: game state → cell state; action → perturbation; goal → pathway survival objective",
    "Kaggle notebook: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase8/asra-phase-8-arc-prize-2026.ipynb",
    "Conceptual article: https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase8/asra-phase8-decision-biology-bridge.md",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASRA for Decision Biology",
      href: "https://sci-layer.vercel.app/articles/asra-for-decision-biology",
    },
    {
      label: "ASRA Phase 8 Kaggle notebook",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase8/asra-phase-8-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA Phase 8 Kaggle kernel",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-phase-8-arc-prize-2026",
    },
    {
      label: "Phase 8 conceptual article (ASRA)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase8/asra-phase8-decision-biology-bridge.md",
    },
    {
      label: "Decision Biology product site",
      href: "https://decision-biology.vercel.app",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
  ]),
  hashtags: ["#ASRA", "#DecisionBiology", "#NFM", "#perturbation", "#scilayer"],
};
