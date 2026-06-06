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

/** Evidence 11 — ASRA Phase 4 Semantics & Causal Inference Engine (ARC-AGI-3). */
export const asraPhase4EvidenceSection: ExceptionalAbilitySection = {
  number: 11,
  title: "ASRA Phase 4 - ARC-AGI-3: Semantics & Causal Inference Engine",
  paragraphs: [
    "After ASRA Phase 1 (transition-centric experience), Phase 2 (object-centric observation), and Phase 3 (directed exploration and episodic memory), I designed and implemented ASRA Phase 4, the Semantics & Causal Inference Engine: a stack that aggregates action–effect observations into semantic signatures, maintains a causal transition model for predicting next-state features, tracks hypotheses with confirm/refute updates, supports counterfactual queries over alternate actions, and scores epistemic uncertainty per (state, action) pair—then deploys a compact CausalSemanticsEngine alongside Phase 2 object-scene and Phase 3 exploration hints in the ARC Prize 2026 competition agent (asra-v0.6-phase4).",
    "Phase 4 answers questions that define scientific and strategic reasoning over interventions: If I take ACTION3 here, what will happen? How confident am I? What would have happened if I had taken ACTION1 instead?",
    "I designed Phase 4 theory (intervention–response tuples without oracle action labels; semantic labels from cell diffs and Phase 2 transform histograms; confidence and uncertainty scoring; hypothesis confirm/refute; counterfactual effect lookup; explicit bridge to Decision Biology perturbation–response structure), implemented the causality stack in asra-arc/src/asra/causality/ (ActionEffectSummarizer, CausalTransitionModel, HypothesisTester, CounterfactualSimulator, UncertaintyScorer, SemanticsStore, and CausalExplorationPolicyV3), validated on ARC-AGI-3 transition logs (semantics consistency, effect-prediction MAE vs naive baseline, hypothesis confirm rates), and deployed the Kaggle notebook with isolated venv bootstrap and combined scoring across Phases 1–4.",
    "Ilakkuvaselvi Manoharan (2026). [Causal Action Semantics: ASRA Phase 4 — From Observed Effects to Intervention Reasoning](https://sci-layer.vercel.app/articles/causal-action-semantics-asra-phase-4). Article, SciLayer Systems (preprint).",
    "Contribution: Extends ASRA from directed exploration to causal semantics—empirical action meaning from observed effects, distributional effect signatures, hypothesis testing and counterfactual lookup, and uncertainty-aware action scoring integrated with Phase 1 transitions, Phase 2 object hints, and Phase 3 exploration memory in the competition agent.",
    "Why this supports exceptional ability: Demonstrates sustained original work across four ASRA layers—experience, observation, navigation, and causal semantics—combining theory, measurable evaluation on transition logs, open-source implementation, and competition-scale deployment within a single named architecture program aimed at adaptive scientific reasoning.",
  ],
  bullets: [
    "Phase 1 Experience Engine → Phase 2 Observation Engine → Phase 3 Navigation & Memory Engine → Phase 4 Semantics & Causal Inference Engine → planned goal inference and planning phases",
    "Causality library: https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/causality",
    "Agent asra-v0.6-phase4: semantic labels, confidence, uncertainty, and predicted progress wired into combined Phase 1–4 scoring",
    "Kaggle notebook (ASRA repo): https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase4/asra-phase-4-arc-prize-2026.ipynb",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASRA Phase 4 article",
      href: "https://sci-layer.vercel.app/articles/causal-action-semantics-asra-phase-4",
    },
    {
      label: "ASRA Phase 4 Kaggle notebook (ASRA GitHub)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase4/asra-phase-4-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA causality library",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/causality",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ASRA Phase 3 (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/directed-exploration-episodic-memory-asra-phase-3",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#causality", "#scilayer"],
};
