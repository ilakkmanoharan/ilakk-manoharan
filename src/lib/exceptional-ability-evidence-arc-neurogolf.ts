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

/** Evidence 20 — ARC-Genome / NeuroGolf 2026 neural circuit compiler. */
export const arcNeurogolfEvidenceSection: ExceptionalAbilitySection = {
  number: 20,
  title:
    "ARC-Genome — minimal neural circuits for NeuroGolf 2026 (ARC-AGI / ONNX)",
  paragraphs: [
    "I built ARC-Genome (ARC-NeuroGolf)—a neural circuit compiler for the NeuroGolf 2026 Kaggle competition (IJCAI-ECAI 2026, $50K prize pool). Unlike ARC Prize's solve-the-task framing, NeuroGolf asks: what is the cheapest neural network that implements the transformation? Score is minimum-description-length: max(1, 25 − ln(cost)) where cost = parameters + memory_bytes—only functionally correct ONNX graphs that generalize to ARC-GEN-100K synthetic variants earn points.",
    "The compiler hypothesis rejects train-then-compress. Each of 400 ARC-AGI tasks is treated as program synthesis: infer transformation φ from examples, compile φ to a minimal static ONNX graph (Gather, Slice, Conv, etc.—no dynamic control flow), validate on train, test, and ARC-GEN samples.",
    "I implemented six cumulative phases in arc_genome/: Phase 1 calibrated cost metrology; Phase 2 structural compilation (kernel budget, sparsification—199 tasks, Kaggle 388.20); Phases 3–5 extended analytical ops, composition search, and two-pass recovery; Phase 6 ARC-GEN validation gate and cost audit. Milestone 1 proved only 23 of 199 locally 'solved' tasks were pass_all earners—exactly matching leaderboard 388.20. Milestone 1b re-solving with ARC-GEN gating at acceptance raised verified tasks to 52 with estimated score ~843.",
    "Central empirical findings: (1) conv least-squares dominates local solve count but 88% fail ARC-GEN—memorization, not rules; (2) fewer verified tasks can score higher—52 pass_all (~843 est.) beats 199 solved (388); (3) analytical circuits worth 10–20× conv wins; (4) official ORT-profiler scoring must gate acceptance, not local MAC estimates.",
    "Why this supports exceptional ability: Demonstrates original competition engineering at the intersection of program synthesis, neural compilation, and ARC-AGI—six phased compiler with reproducible run_phase.py workflow, official scorer integration, tier audit tooling, and a full project paper documenting methodology and measurement corrections—open source on GitHub.",
  ],
  bullets: [
    "NeuroGolf 2026: ARC-AGI v1 → minimal ONNX per task; score = MDL over parameters + memory",
    "ARC-Genome: 11+ analytical solvers, composition search, conv fallbacks, ARC-GEN gate",
    "Kaggle verified: 388.20 (23 pass_all); Milestone 1b: 52 pass_all, ~843 estimated",
    "Repository: https://github.com/ilakkmanoharan/ARC-NeuroGolf",
  ],
  links: withPortfolioLinks([
    {
      label: "ARC-NeuroGolf on GitHub",
      href: "https://github.com/ilakkmanoharan/ARC-NeuroGolf",
    },
    {
      label: "Project paper (GitHub)",
      href: "https://github.com/ilakkmanoharan/ARC-NeuroGolf/blob/main/private/paper.md",
    },
    {
      label: "NeuroGolf 2026 on Kaggle",
      href: "https://www.kaggle.com/competitions/neurogolf-2026",
    },
    { label: "Projects page", href: "/projects" },
  ]),
  hashtags: [
    "#ARCGenome",
    "#NeuroGolf",
    "#ARCAGI",
    "#ONNX",
    "#ProgramSynthesis",
    "#Kaggle",
  ],
};
