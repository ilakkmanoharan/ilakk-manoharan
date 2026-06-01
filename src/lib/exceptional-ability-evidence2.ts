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

/** Evidence 2 — ASRA scholarly record on SciLayer. */
export const scilayerScholarlyEvidenceSection: ExceptionalAbilitySection = {
  number: 2,
  title: "ASRA scholarly record on SciLayer — published preprints",
  paragraphs: [
    "I have developed ASRA (Adaptive Scientific Reasoning Architecture)—a coherent research program that treats scientific and interactive intelligence as reasoning from state transitions under uncertainty, not as execution of predefined policies. The work spans:",
    "This combination—original theoretical framing, multi-paper development with versioned revisions, open implementations, and infrastructure to disseminate and review the work—demonstrates sustained, high-level contribution at the intersection of AI, scientific reasoning, and systems engineering.",
    "Published scholarly record on SciLayer — The following works are sole-authored by me, publicly accessible, CC-BY-4.0 licensed where stated on the platform, and cross-linked as a unified program (each later paper cites earlier SciLayer releases).",
    "1. Concept Paper — architecture-level synthesis",
    "I. (2026). Architectures for Adaptive Scientific Reasoning Under Uncertainty. Concept Paper, SciLayer Systems (preprint).",
    "Contribution: A long-form conceptual review arguing that scientific intelligence requires architectures that distinguish observation from intervention, update beliefs from transitions, and select experiments under uncertainty. Integrates Dreamer/MuZero-style world models, Pearlian causality, free-energy/active inference, information-theoretic experiment value, and modern perturbation atlases (LINCS, scPerturb, Human Cell Atlas) into a unified design vocabulary for adaptive scientific reasoning systems. Identifies open problems: scalable causal representation learning, calibrated uncertainty in high-dimensional biology, interpretable abstraction, and benchmarks that bridge interactive games and real experimentation.",
    "Why this supports exceptional ability: Demonstrates original scholarly authorship at synthesis level—not incremental tuning of existing models, but a field-spanning framework that other ASRA papers implement and extend.",
    "2. Article — pedagogical and technical exposition of core mechanism",
    "I. (2026). Understanding Action Semantics Inference Through State Transitions in ASRA. Article, SciLayer Systems (preprint).",
    "Contribution: Defines action semantics inference: discovering what abstract action tokens mean by analyzing before/after state transitions when no programmer-supplied semantics exist. Works through grids, diff localization, repeated transitions, and compression into predictive rules—making the ASRA mechanism accessible to engineers and researchers. Connects the idea to ARC-style environments and Decision Biology (perturbations as interventions).",
    "Supplement: Video demonstration linked from the manuscript (YouTube).",
    "Why this supports exceptional ability: Shows ability to communicate and formalize a novel cognitive mechanism for adaptive systems—bridging research exposition and implementable design.",
    "3. Article — ASRA for Decision Biology (versioned research article)",
    "I. (2026). ASRA for Decision Biology. Article, SciLayer Systems (preprint); Version 2 current.",
    "Contribution: Applies the ASRA architecture to decision biology—perturbation–response reasoning, world models, and intervention-centric scientific intelligence in biological state spaces. Maintains distinct versions (v1, v2) documenting evolution of the manuscript.",
    "Why this supports exceptional ability: Demonstrates domain transfer of the same architectural abstraction from interactive/grid settings to biological reasoning—a mark of generalizable scientific contribution rather than a single benchmark hack.",
    "4. Article — Transition-centric Phase 1 (versioned; v2 current)",
    "I. (2026). Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments. Article, SciLayer Systems (preprint); Version 2.0 current.",
    "Version 1 (2026-05-28): Platform-agnostic specification of the Phase 1 loop—observe → log transition → infer semantics → explore under uncertainty—with cognitive design, algorithms, and limitations.",
    "Version 2 (2026-06-01): Extends v1 with execution fidelity theory (isolated scientific runtime, validation vs. deployment phases), game-state lifecycle alignment with competition APIs, and multi-game orchestration for scaling single-episode reasoning to evaluation campaigns (ARC Prize 2026 context).",
    "Contribution: Specifies a minimal, auditable agent architecture for environments where action meaning and rules are hidden; explicitly positions Phase 1 as the exploration front-end of a larger program (Nature Foundation Models, Decision Biology, conceptual review). Cross-cites prior SciLayer releases with public URLs.",
    "Why this supports exceptional ability: Shows iterative original research with substantive v2 revision (not cosmetic edits), systems thinking (runtime isolation, orchestration), and engagement with leading interactive-AI benchmarks (ARC-AGI-3 documentation and competition mechanics).",
    "Coherent research program (how the papers fit together):",
    "Conceptual review (architecture under uncertainty) → Action semantics inference (core mechanism, exposition) → Phase 1 interactive agent (executable loop + v2 execution theory) → Decision Biology application (domain transfer), with open implementation at github.com/ilakkmanoharan/asra.",
    "I am not a single-paper contributor; I am building a named architecture (ASRA) with multiple peer-reviewable components, explicit versioning, and public cross-citation—consistent with sustained work in AI for science and adaptive intelligence.",
    "Additional evidence: SciLayer platform (technical exceptional ability)",
    "SciLayer is an open scholarly archive and publishing stack I implemented (Next.js, TypeScript, ORCID OAuth, manuscript upload and archival, reviewer workspace, article versioning, taxonomy classification). The platform hosts the ASRA corpus above and demonstrates:",
    "This is relevant where exceptional ability is shown through original contributions of major significance in both research and implementation—I authored the science and built the infrastructure to publish and review it transparently.",
    "Suggested citation block (for petitions or CV):",
    "I. (2026). Architectures for Adaptive Scientific Reasoning Under Uncertainty. SciLayer. https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty",
    "I. (2026). Understanding Action Semantics Inference Through State Transitions in ASRA. SciLayer. https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra",
    "I. (2026). ASRA for Decision Biology (Version 2). SciLayer. https://sci-layer.vercel.app/articles/asra-for-decision-biology",
    "I. (2026). Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments (Version 2). SciLayer. https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
  ],
  bullets: [
    "Conceptual synthesis across model-based reinforcement learning, causal inference, active inference, information theory, and perturbation biology into a single architecture-level framework for adaptive scientific reasoning.",
    "Operational theory for inferring latent action semantics when action labels are unknown—directly relevant to ARC-style interactive benchmarks and to perturbation biology (interventions as actions, cellular readouts as states).",
    "Executable Phase 1 architecture for grid-world agents that log transitions, infer semantics, and explore under uncertainty—with a second major revision adding execution fidelity, validation vs. scoring separation, and multi-game orchestration for competition-scale evaluation.",
    "Domain application to Decision Biology, linking world models and intervention-centric reasoning to biological perturbation–response systems.",
    "Scholarly infrastructure—design and implementation of SciLayer, a production web platform (ORCID authentication, manuscript upload, peer-review workspace, versioning, public article pages) that publishes this body of work with persistent URLs and structured metadata.",
    "Mapping — Original contributions of major significance: ASRA framework; action semantics inference; Phase 1 architecture with v2 execution/orchestration theory; Decision Biology application.",
    "Mapping — Scholarly publications: Four distinct preprints on SciLayer (Concept Paper + three Articles), version histories where applicable.",
    "Mapping — Leading / critical role: Sole author; affiliation with Nature Foundation Models research direction; program-level framing across papers.",
    "Mapping — Technical prowess: SciLayer codebase; ASRA GitHub repository; video supplement on action semantics.",
    "End-to-end product engineering from specification to deployed production (Vercel).",
    "Scholarly workflow design (upload, review, public article pages, author profiles).",
    "Commitment to open science (committed content/articles manuscripts, CC-BY preprints, ORCID identity).",
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
  hashtags: ["#ASRA", "#scilayer", "#openscience", "#decisionbiology"],
};
