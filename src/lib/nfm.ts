const SCILAYER = "https://sci-layer.vercel.app/articles";

/** Dedicated NFM program site (vision, hierarchy, Atlas-GS, media). */
export const NFM_PROGRAM_SITE = "https://nature-foundation-models.vercel.app";

export type NfmPaper = {
  title: string;
  href: string;
  category: string;
};

export type NfmStackLayer = {
  name: string;
  role: string;
  status: string;
  description: string;
};

export const nfmStackLayers: NfmStackLayer[] = [
  {
    name: "Nature Foundation Models (NFM)",
    role: "Research program",
    status: "Active",
    description:
      "Learn the structure of reality through interaction—world models, action semantics, causal structure, and mechanisms as one developmental arc from embodied experience to scientific reasoning.",
  },
  {
    name: "NFM-Worlds",
    role: "World-modeling platform (brain)",
    status: "Scaffold",
    description:
      "Shared world state, dynamics, and transition abstractions—State_t + Action_t → State_{t+1} across robotics, biology, chemistry, and ecology.",
  },
  {
    name: "NFM-Robotics",
    role: "Embodiment infrastructure (body)",
    status: "Scaffold",
    description:
      "Sensors, actuators, and sim/real embodiment pipelines that ground world models in physical interaction and tight feedback loops.",
  },
  {
    name: "Atlas",
    role: "Robotics project family",
    status: "Scaffold",
    description:
      "Navigation, manipulation, and observation as knowledge acquisition—not just task completion.",
  },
  {
    name: "Atlas-GS",
    role: "Gaussian Splatting implementation",
    status: "v1 live",
    description:
      "RGB-D → persistent 3D Gaussian world models: mapping, localization, scene memory, and transition logging—CPU-first, simulation-first, Phases 0–6 complete.",
  },
];

export const nfmDevelopmentStages = [
  "World Representation (Atlas-GS v1 — today)",
  "Action Semantics Learning",
  "Causal Discovery",
  "Mechanism Discovery",
  "Hypothesis Generation",
  "Active Experiment Design",
  "Adaptive Scientific Reasoning (ASRA)",
];

export const atlasGsMetrics = [
  { label: "TUM RGB-D fr1_xyz localization RMSE", value: "0.0102 m" },
  { label: "Gaussians in map (TUM demo)", value: "4,018" },
  { label: "Transitions logged", value: "39" },
  { label: "Phases completed", value: "0–6 end-to-end" },
];

export const nfmPapers: NfmPaper[] = [
  {
    category: "Nature Foundation Models",
    title:
      "Nature Foundation Models: A Hierarchical Framework for Learning Worlds, Embodiment, and Scientific Intelligence",
    href: `${SCILAYER}/nature-foundation-models-hierarchical-framework`,
  },
  {
    category: "Nature Foundation Models",
    title:
      "Atlas-GS: An End-to-End Implementation of Gaussian World Modeling for Embodied Robotics",
    href: `${SCILAYER}/atlas-gs-end-to-end-implementation`,
  },
  {
    category: "ASRA — Foundations",
    title:
      "Architectures for Adaptive Scientific Reasoning Under Uncertainty",
    href: `${SCILAYER}/architectures-adaptive-scientific-reasoning-under-uncertainty`,
  },
  {
    category: "ASRA — Foundations",
    title:
      "Understanding Action Semantics Inference Through State Transitions in ASRA",
    href: `${SCILAYER}/understanding-action-semantics-inference-through-state-transitions-in-asra`,
  },
  {
    category: "ASRA — Foundations",
    title: "ASRA for Decision Biology",
    href: `${SCILAYER}/asra-for-decision-biology`,
  },
  {
    category: "ASRA — Phase 1",
    title: "Transition-Centric Adaptive Reasoning: ASRA Phase 1",
    href: `${SCILAYER}/transition-centric-adaptive-reasoning-asra-phase-1`,
  },
  {
    category: "ASRA — Phase 2",
    title: "Object-Centric Adaptive Reasoning: ASRA Phase 2",
    href: `${SCILAYER}/object-centric-adaptive-reasoning-asra-phase-2`,
  },
  {
    category: "ASRA — Phase 3",
    title: "Directed Exploration and Episodic Memory: ASRA Phase 3",
    href: `${SCILAYER}/directed-exploration-episodic-memory-asra-phase-3`,
  },
  {
    category: "ASRA — Phase 3",
    title:
      "ASRA Phase 3 — Exploration, Memory & Navigation (Technical Specification)",
    href: `${SCILAYER}/asra-phase-3-exploration-memory-navigation-spec`,
  },
  {
    category: "ASRA — Phase 4",
    title: "Causal Action Semantics: ASRA Phase 4",
    href: `${SCILAYER}/causal-action-semantics-asra-phase-4`,
  },
  {
    category: "ASRA — Phase 5",
    title: "Goal Inference and Hypothesis Ranking: ASRA Phase 5",
    href: `${SCILAYER}/goal-inference-hypothesis-ranking-asra-phase-5`,
  },
  {
    category: "ASRA — Phase 6",
    title: "Planning and Strategy Invention: ASRA Phase 6",
    href: `${SCILAYER}/planning-strategy-invention-asra-phase-6`,
  },
  {
    category: "ASRA — Phase 7",
    title: "Robustness and Generalization: ASRA Phase 7",
    href: `${SCILAYER}/robustness-generalization-asra-phase-7`,
  },
  {
    category: "ASRA — Phase 8",
    title: "Decision Biology Bridge: ASRA Phase 8",
    href: `${SCILAYER}/decision-biology-bridge-asra-phase-8`,
  },
  {
    category: "ASRA — Phase 9",
    title: "Final Submission Research Story: ASRA Phase 9",
    href: `${SCILAYER}/final-submission-research-story-asra-phase-9`,
  },
];

export const nfmLinks = {
  programSite: NFM_PROGRAM_SITE,
  programPage: "/nfm",
  nfmGithub: "https://github.com/ilakkmanoharan/Nature-Foundation-Models",
  asraGithub: "https://github.com/ilakkmanoharan/asra",
  scilayer: "https://sci-layer.vercel.app",
  decisionBiology: "https://decision-biology.vercel.app",
  asraPage: "/asra",
  startupCatalog: "/startups",
} as const;
