export type AsraVideo = {
  title: string;
  description: string;
  youtubeUrl: string;
};

export const asraVideos: AsraVideo[] = [
  {
    title:
      "Understanding Action Semantics Inference Through State Transitions in ASRA",
    description:
      "Explains how ASRA discovers what actions mean without being told—using a simple 3×3 grid example (Before → ACTION → After), change detection, semantic convergence, and a concrete update rule—then connects it to ARC reasoning, world models, Decision Biology, and the ASRA loop.",
    youtubeUrl: "https://youtu.be/VmQygZPgK5A?si=_zhCbog5BEna7h7U",
  },
  {
    title: "Nature Foundation Models, Decision Biology, and A-S-R-A — Adaptive Scientific Intelligence",
    description:
      "Technical overview (~10 min) of the research stack: why current AI is insufficient for scientific discovery, what Nature Foundation Models aim to build, how Decision Biology reframes cells as information-processing agents, and how A‑S‑R‑A learns hidden action semantics and evolving world models through interaction.",
    youtubeUrl: "https://youtu.be/ssBvn41W1BE?si=7rT1w7QLpk2a7XjS",
  },
  {
    title: "ASRA Phase 1: First 10 Replay Frames — Guided Tutorial",
    description:
      "Walkthrough of ASRA Phase 1 replay frames: before/after grids, changed cells, movement labels, and the on‑screen formula preview—clarifying that the mock backend cycles color in fixed cells (not spatial movement).",
    youtubeUrl: "https://youtu.be/L-4dqw0oZCA?si=U5Rn2mJ77A3YThXk",
  },
  {
    title:
      "ASRA Phase 1: Animated Replay Walkthrough — How the Agent Sees, Acts, and Remembers",
    description:
      "Narrated tour of the Phase 1 Animated Replay viewer: how episodes auto-play, how diffs are highlighted, why early RESET steps may show no change, and how replay ties to memory-on-disk and later learning.",
    youtubeUrl: "https://youtu.be/2yvEltzWhfM?si=dol-fAbI7LGHLMad",
  },
  {
    title:
      "A-S-R-A, Decision Biology, and Nature Foundation Models — Adaptive Scientific Intelligence",
    description:
      "Concise overview of the A‑S‑R‑A stack: limits of benchmark-bound AI, science as an observe → experiment → infer loop, Decision Biology as the first domain, and Nature Foundation Models as multi-domain scientific intelligence.",
    youtubeUrl: "https://youtu.be/3PKC5MdBE6s?si=4VUZLqOSuDD9APrq",
  },
  {
    title: "ASRA Phase 1: Building Experiential Memory for Adaptive AI",
    description:
      "Explains Phase 1 as an experience engine: logging transitions, grid differencing, stable state hashes, replay, dead-end detection, and state graph construction—building datasets for later semantics and world-model learning.",
    youtubeUrl: "https://youtu.be/Jyak9_ev8h0?si=nYzN_CMCV0TDCSgh",
  },
  {
    title: "Action Semantic Inference in ASRA: Learning Meaning Through Interaction",
    description:
      "Explainer on how ASRA infers unknown action meaning via experimentation, state differencing, causal reasoning, uncertainty reduction, memory, and abstraction in ARC-style environments—and why it matters for adaptive systems and scientific reasoning.",
    youtubeUrl: "https://youtu.be/EDpNWZJPlvA?si=ozccUWHgd5E1NRKe",
  },
];

export const asraPapers = [
  {
    title:
      "ASRA: Adaptive Scientific Reasoning Architectures for Decision Biology (v2)",
    href: "/papers/asra_for_decision_biology_v2.pdf",
  },
  {
    title:
      "ASRA: Adaptive Scientific Reasoning Architectures for Decision Biology (v1)",
    href: "/papers/asra_for_decision_biology_v1.pdf",
  },
] as const;

