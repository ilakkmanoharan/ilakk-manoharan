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

/** Evidence 16 — Orbit Wars Kaggle competition agent pipeline. */
export const orbitWarsEvidenceSection: ExceptionalAbilitySection = {
  number: 16,
  title: "Orbit Wars — Kaggle RTS competition agent pipeline",
  paragraphs: [
    "I built and open-sourced a complete AI agent pipeline for Orbit Wars, a featured Kaggle real-time strategy competition with a $50,000 prize pool: bots send fleets across a continuous 2D solar system to capture orbiting planets, intercept comets, and outproduce opponents over 500 turns—under a strict one-second-per-turn latency budget.",
    "Rather than a single opaque bot, I engineered a four-phase progression—each phase with a design paper, isolated competition-ready code, and a live ladder submission. In one day I went from an empty repo to five validated submissions, including two distinct strategies tracked for the final ranking (only the latest two submissions count).",
    "Phase 0 established the ladder (nearest expansion with garrison floor and sun avoidance, μ = 505.8). Phase 1 added orbit prediction, intercept ETA, and production-weighted heuristics. Phase 2 introduced a six-policy forward simulator with 12-turn rollouts and opponent modeling. Phase 3 added game-phase awareness, FFA meta-strategy, comet windows, and an aggressive variant—classical interpretable game AI, not opaque ML, because the time budget demands it.",
    "Contribution: End-to-end competition engineering—shared geometry library, automated Kaggle bundling, smoke tests, versioned design papers, and competition-format strategy (conservative when ahead, neutral farming when outgunned, dual final bots hedging the latest-two rule)—fully reproducible in the public repo.",
    "Why this supports exceptional ability: Demonstrates disciplined systems thinking under hard constraints—geometry, planning, and engineering discipline in a novel RTS domain—with open documentation, measurable ladder progress, and rapid execution from concept to five competition submissions in a single session.",
  ],
  bullets: [
    "Phased repo: Phase 0 → Phase 1 (geometry) → Phase 2 (simulation) → Phase 3 (competition meta + aggressive variant)",
    "Orbit Wars on GitHub: https://github.com/ilakkmanoharan/orbit-wars",
    "Phase papers: https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase0 · https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase1 · https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase2 · https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase3",
    "Tooling: https://github.com/ilakkmanoharan/orbit-wars/blob/main/scripts/bundle.sh · https://github.com/ilakkmanoharan/orbit-wars/blob/main/tests/run_all.py",
  ],
  links: withPortfolioLinks([
    {
      label: "Orbit Wars on GitHub",
      href: "https://github.com/ilakkmanoharan/orbit-wars",
    },
    {
      label: "Phase 0 — baseline",
      href: "https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase0",
    },
    {
      label: "Phase 1 — heuristics",
      href: "https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase1",
    },
    {
      label: "Phase 2 — simulation",
      href: "https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase2",
    },
    {
      label: "Phase 3 — competition meta",
      href: "https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase3",
    },
    {
      label: "Phase 0 design paper",
      href: "https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase0/paper.md",
    },
    {
      label: "Phase 3 design paper",
      href: "https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase3/paper.md",
    },
    {
      label: "Kaggle bundle script",
      href: "https://github.com/ilakkmanoharan/orbit-wars/blob/main/scripts/bundle.sh",
    },
    {
      label: "Orbit Wars on Kaggle",
      href: "https://www.kaggle.com/competitions/orbit-wars",
    },
  ]),
  hashtags: ["#OrbitWars", "#Kaggle", "#GameAI", "#OpenSource"],
};
