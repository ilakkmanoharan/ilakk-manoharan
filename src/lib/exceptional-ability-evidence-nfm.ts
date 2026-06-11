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

/** Evidence 19 — Nature Foundation Models program & Atlas-GS v1. */
export const nfmAtlasGsEvidenceSection: ExceptionalAbilitySection = {
  number: 19,
  title:
    "Nature Foundation Models — hierarchical program & Atlas-GS v1 implementation",
  paragraphs: [
    "Beyond ASRA as a competition stack, I designed Nature Foundation Models (NFM) as a long-term research program: learn persistent world models, action semantics, causal structure, and mechanisms from interaction—not as disconnected modules, but as one developmental arc from embodied experience to adaptive scientific reasoning.",
    "NFM organizes work as a hierarchy—NFM (program) → NFM-Worlds (shared world state and dynamics) → NFM-Robotics (embodiment) → Atlas (robotics project family) → Atlas-GS (first runnable implementation). The core abstraction is State_t + Action_t → State_{t+1}; the seven-stage pipeline progresses from world representation through action semantics, causality, mechanism discovery, hypothesis generation, active experimentation, and adaptive scientific reasoning (ASRA).",
    "Atlas-GS v1 is live: a modular Python package that ingests RGB-D (TUM benchmarks or synthetic rooms), builds persistent 3D Gaussian world models, localizes against the map, saves world bundles, and logs transition tuples—Phases 0–6 complete, CPU-first, simulation-first. On TUM RGB-D fr1_xyz: 4,018 gaussians, 0.0102 m localization RMSE, 39 transitions logged. This establishes the substrate for v2 action semantics and v3+ causal world models without architectural rework.",
    "Ilakkuvaselvi Manoharan (2026). [Nature Foundation Models: A Hierarchical Framework for Learning Worlds, Embodiment, and Scientific Intelligence](https://sci-layer.vercel.app/articles/nature-foundation-models-hierarchical-framework) (Version 2). Article, SciLayer Systems (preprint).",
    "Ilakkuvaselvi Manoharan (2026). [Atlas-GS: An End-to-End Implementation of Gaussian World Modeling for Embodied Robotics](https://sci-layer.vercel.app/articles/atlas-gs-end-to-end-implementation). Article, SciLayer Systems (preprint).",
  ],
  bullets: [
    "NFM stack: program → worlds → robotics → Atlas → Atlas-GS (v1 implemented)",
    "Atlas-GS: mapping, localization, scene memory, transition logging — TUM fr1_xyz 0.0102 m RMSE",
    "Repository: github.com/ilakkmanoharan/Nature-Foundation-Models (NFM-Robotics/Atlas/Atlas-GS)",
    "Program page with all SciLayer papers: ilakk-manoharan.vercel.app/nfm",
  ],
  links: withPortfolioLinks([
    { label: "Nature Foundation Models (NFM page)", href: "/nfm" },
    {
      label: "NFM on GitHub",
      href: "https://github.com/ilakkmanoharan/Nature-Foundation-Models",
    },
    {
      label: "NFM hierarchical framework (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/nature-foundation-models-hierarchical-framework",
    },
    {
      label: "Atlas-GS implementation paper (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/atlas-gs-end-to-end-implementation",
    },
    { label: "ASRA on GitHub", href: "https://github.com/ilakkmanoharan/asra" },
    { label: "ASRA page", href: "/asra" },
    {
      label: "Decision Biology",
      href: "https://decision-biology.vercel.app",
    },
    { label: "SciLayer", href: "https://sci-layer.vercel.app" },
  ]),
  hashtags: [
    "#NatureFoundationModels",
    "#AtlasGS",
    "#worldmodels",
    "#embodiedAI",
    "#scientificAI",
  ],
};
