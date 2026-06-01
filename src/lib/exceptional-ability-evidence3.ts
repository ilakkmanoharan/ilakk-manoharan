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

/** Evidence 3 — ASRA Phase 2 Observation Engine (ARC-AGI-3). */
export const asraPhase2EvidenceSection: ExceptionalAbilitySection = {
  number: 3,
  title: "ASRA Phase 2 - ARC-AGI-3: Object-Centric Observation Engine",
  paragraphs: [
    "After establishing ASRA Phase 1—reasoning from state transitions when action labels and environment rules are hidden—I designed and implemented ASRA Phase 2, the Observation Engine: a pipeline that converts integer grid observations into objects, regions, typed transformation events, and explicit rule hypotheses, then feeds compact structural hints back into the same interactive agent used for ARC Prize 2026 (ARC-AGI-3).",
    "Phase 2 is an original symbolization layer that answers: What structural entities changed between observations, and what operator class best describes that change? Without it, action-semantics inference collapses into coarse cell-diff buckets that cannot distinguish rotation from creation, recoloring from translation, or heterogeneous demo programs from a single global rule.",
    "I designed the Phase 2 theory (object scenes, transform taxonomy, abductive rule induction, branched demo hypotheses, soft integration with Phase 1), implemented a modular perception stack in the open ASRA repository (ObjectExtractor, RegionDetector, ShapeMatcher, TransformationDetector, RuleCandidateGenerator, BeforeAfterAnalyzer), evaluated it on 800 Original ARC tasks (400 training + 400 evaluation) with 100% rule-candidate coverage and branched per-demo hypotheses where cross-demo operator heterogeneity is real (~2% of tasks), and deployed Phase 2 in a Kaggle competition notebook (asra-v0.4-phase2) with isolated runtime bootstrap and object-scene hints wired into exploration scoring.",
    "Ilakkuvaselvi Manoharan (2026). [Object-Centric Adaptive Reasoning: ASRA Phase 2 — From Pixel Transitions to Symbolic Structure](https://sci-layer.vercel.app/articles/object-centric-adaptive-reasoning-asra-phase-2). Article, SciLayer Systems (preprint).",
    "Contribution: Extends ASRA from transition logging to object-centric perception—segmenting grids into connected components, classifying CREATE/DELETE/ROTATE/TRANSLATE/RECOLOR and related transforms, inducing global or branched rule hypotheses when ARC demonstration pairs disagree, and integrating structural hints with Phase 1 exploration without abandoning empirical transitions.",
    "Why this supports exceptional ability: Demonstrates original architecture-level work combining theory, measurable batch science (800-task evaluation), open-source implementation, and competition-scale deployment—extending a named program (ASRA) rather than a disconnected benchmark entry.",
  ],
  bullets: [
    "Phase 1 Experience Engine → Phase 2 Observation Engine → planned exploration, semantics, and planning phases in the ASRA roadmap",
    "Perception library: https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/perception",
    "Batch evaluation: 100% rule-candidate coverage on 800 Original ARC tasks; branched hypotheses when demo operators diverge",
    "Kaggle notebook (ASRA repo): https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase2/asra-phase-2-arc-prize-2026.ipynb",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASRA Phase 2 article",
      href: "https://sci-layer.vercel.app/articles/object-centric-adaptive-reasoning-asra-phase-2",
    },
    {
      label: "ASRA Phase 2 Kaggle notebook (ASRA GitHub)",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/kaggle-notebooks/phase2/asra-phase-2-arc-prize-2026.ipynb",
    },
    {
      label: "ASRA perception library",
      href: "https://github.com/ilakkmanoharan/asra/tree/main/asra-arc/src/asra/perception",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "ASRA Phase 1 (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRA", "#ARCPrize2026", "#ARCAGI3", "#objectcentric", "#scilayer"],
};
