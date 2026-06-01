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

/** Evidence 2 — ASRA Phase 1 scholarly record on SciLayer. */
export const scilayerScholarlyEvidenceSection: ExceptionalAbilitySection = {
  number: 2,
  title: "ASRA Phase 1 - scholarly record on SciLayer — published preprints",
  paragraphs: [
    "I have developed ASRA (Adaptive Scientific Reasoning Architecture)—a coherent research program that treats scientific and interactive intelligence as reasoning from state transitions under uncertainty, not as execution of predefined policies.",
    "This combination—original theoretical framing, multi-paper development with versioned revisions, open implementations, and infrastructure to disseminate and review the work—demonstrates sustained, high-level contribution at the intersection of AI, scientific reasoning, and systems engineering.",
    "Published scholarly record on [SciLayer](https://sci-layer.vercel.app) and the [Social Science Research Network (SSRN)](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6835331) — The following works are sole-authored by me, publicly accessible, CC-BY-4.0 licensed where stated on SciLayer, and cross-linked as a unified program (each later paper cites earlier SciLayer releases). ASRA for Decision Biology is indexed on SSRN (abstract ID 6835331).",
    "1. Concept Paper — architecture-level synthesis",
    "Ilakkuvaselvi Manoharan (2026). [Architectures for Adaptive Scientific Reasoning Under Uncertainty](https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty). Concept Paper, SciLayer Systems (preprint).",
    "Contribution: A long-form conceptual review arguing that scientific intelligence requires architectures that distinguish observation from intervention, update beliefs from transitions, and select experiments under uncertainty. Integrates Dreamer/MuZero-style world models, Pearlian causality, free-energy/active inference, information-theoretic experiment value, and modern perturbation atlases (LINCS, scPerturb, Human Cell Atlas) into a unified design vocabulary for adaptive scientific reasoning systems. Identifies open problems: scalable causal representation learning, calibrated uncertainty in high-dimensional biology, interpretable abstraction, and benchmarks that bridge interactive games and real experimentation.",
    "Why this supports exceptional ability: Demonstrates original scholarly authorship at synthesis level—a field-spanning framework that other ASRA papers implement and extend.",
    "2. Article — pedagogical and technical exposition of core mechanism",
    "Ilakkuvaselvi Manoharan (2026). [Understanding Action Semantics Inference Through State Transitions in ASRA](https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra). Article, SciLayer Systems (preprint).",
    "Contribution: Defines action semantics inference: discovering what abstract action tokens mean by analyzing before/after state transitions when no programmer-supplied semantics exist. Works through grids, diff localization, repeated transitions, and compression into predictive rules—making the ASRA mechanism accessible to engineers and researchers. Connects the idea to ARC-style environments and Decision Biology (perturbations as interventions).",
    "Supplement: [Video demonstration](https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra) linked from the manuscript (YouTube).",
    "Why this supports exceptional ability: Shows ability to communicate and formalize a novel cognitive mechanism for adaptive systems—bridging research exposition and implementable design.",
    "3. Article — ASRA for Decision Biology (versioned research article)",
    "Ilakkuvaselvi Manoharan (2026). [ASRA for Decision Biology](https://sci-layer.vercel.app/articles/asra-for-decision-biology) (Version 2). Article, SciLayer Systems (preprint). [Version history](https://sci-layer.vercel.app/articles/asra-for-decision-biology/versions). PDFs: [v1](https://github.com/ilakkmanoharan/asra/blob/main/paper/asra_for_decision_biology_v1.pdf), [v2](https://github.com/ilakkmanoharan/asra/blob/main/paper/asra_for_decision_biology_v2.pdf). Also published on [SSRN — ASRA for Decision Biology](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6835331).",
    "Contribution: Applies the ASRA architecture to decision biology—perturbation–response reasoning, world models, and intervention-centric scientific intelligence in biological state spaces. Maintains distinct versions (v1, v2) documenting evolution of the manuscript.",
    "Why this supports exceptional ability: Demonstrates domain transfer of the same architectural abstraction from interactive/grid settings to biological reasoning—a mark of generalizable scientific contribution.",
    "4. Article — Transition-centric Phase 1 (versioned; v2 current)",
    "Ilakkuvaselvi Manoharan (2026). [Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments](https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1) (Version 2.0). Article, SciLayer Systems (preprint). [Version history](https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1/versions).",
    "Version 1 (2026-05-28): Platform-agnostic specification of the Phase 1 loop—observe → log transition → infer semantics → explore under uncertainty—with cognitive design, algorithms, and limitations.",
    "Version 2 (2026-06-01): Extends v1 with execution fidelity theory (isolated scientific runtime, validation vs. deployment phases), game-state lifecycle alignment with competition APIs, and multi-game orchestration for scaling single-episode reasoning to evaluation campaigns (ARC Prize 2026 context).",
    "Contribution: Specifies a minimal, auditable agent architecture for environments where action meaning and rules are hidden; explicitly positions Phase 1 as the exploration front-end of a larger program (Nature Foundation Models, Decision Biology, conceptual review). Cross-cites prior SciLayer releases with public URLs.",
    "Why this supports exceptional ability: Shows iterative original research with substantive v2 revision, systems thinking (runtime isolation, orchestration), and engagement with leading interactive-AI benchmarks (ARC-AGI-3 documentation and competition mechanics).",
  ],
  links: withPortfolioLinks([
    { label: "ORCID", href: "https://orcid.org/0009-0008-8073-5416" },
    {
      label: "SciLayer author page",
      href: "https://sci-layer.vercel.app/authors/0009-0008-8073-5416",
    },
    { label: "SciLayer", href: "https://sci-layer.vercel.app" },
    { label: "SciLayer on GitHub", href: "https://github.com/ilakkmanoharan/SciLayer" },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    {
      label: "Concept Paper — Architectures for Adaptive Scientific Reasoning Under Uncertainty",
      href: "https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty",
    },
    {
      label: "Article — Understanding Action Semantics Inference Through State Transitions in ASRA",
      href: "https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra",
    },
    {
      label: "Article — ASRA for Decision Biology (v2)",
      href: "https://sci-layer.vercel.app/articles/asra-for-decision-biology",
    },
    {
      label: "SSRN — ASRA for Decision Biology",
      href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6835331",
    },
    {
      label: "ASRA for Decision Biology — version history",
      href: "https://sci-layer.vercel.app/articles/asra-for-decision-biology/versions",
    },
    {
      label: "Decision Biology PDF v1",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/paper/asra_for_decision_biology_v1.pdf",
    },
    {
      label: "Decision Biology PDF v2",
      href: "https://github.com/ilakkmanoharan/asra/blob/main/paper/asra_for_decision_biology_v2.pdf",
    },
    {
      label: "Article — Transition-Centric Adaptive Reasoning: ASRA Phase 1 (v2)",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
    },
    {
      label: "ASRA Phase 1 — version history",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1/versions",
    },
  ]),
  hashtags: ["#ASRA", "#scilayer", "#openscience", "#decisionbiology", "#SSRN"],
};
