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

/** Evidence 17 — Orbit Wars Phase 4: NFM × ASRA × Atlas-GS. */
export const orbitWarsPhase4EvidenceSection: ExceptionalAbilitySection = {
  number: 17,
  title:
    "Orbit Wars Phase 4 — NFM × ASRA × Atlas-GS for multi-agent RTS",
  paragraphs: [
    "Orbit Wars Phase 4 unifies three research frameworks inside a live Kaggle RTS agent: Nature Foundation Models (NFM) for explicit state–action–dynamics world modeling, Atlas-GS adapted as a 2D Gaussian spatial value field for target prioritization, and ASRA's Observe → Hypothesize → Experiment → Analyze → Act loop for hypothesis-driven policy selection—under Orbit Wars' one-second-per-turn decision budget.",
    "NFM layer: `world_model.py` implements the core abstraction State_t + Action_t → State_{t+1} where state captures planet positions, owners, garrisons, production, active fleets, and step; actions are fleet launches; dynamics include production ticks, orbit rotation, fleet movement, and combat resolution via forward simulation.",
    "Atlas-GS layer: each planet contributes a Gaussian kernel centered at (x, y) with production-weighted value—neutrals by production, enemy planets at production × 0.5, owned planets at production × 2 for defense value. Target priority = gaussian_value(target) / (eta + 1), replacing naive nearest-neighbor with spatially-aware economic reasoning.",
    "ASRA layer: each turn the agent observes the full game state, hypothesizes five strategic theories (economy, aggression, comets, consolidation, balanced—mapped to policy clusters), forward-simulates each hypothesis 15 turns, analyzes predicted ship counts and production totals, and acts on the opening moves of the best-supported hypothesis.",
    "Phase 4 keeps Phase 2's simulation core (best prior ladder score μ = 600) while ladder results showed Phase 3 meta-strategy underperformed (μ ≈ 385–398). Phase 4 adds Gaussian spatial targeting, explicit world-state transitions, and hypothesis-driven policy selection—bridging competition engineering with the NFM / ASRA / Atlas-GS research stack.",
    "Ilakkuvaselvi Manoharan (2026). [Orbit Wars Phase 4: Applying NFM, ASRA, and Atlas-GS to Multi-Agent RTS Competition](https://sci-layer.vercel.app/articles/orbit-wars-nfm-asra-atlas-phase-4). Implementation Paper, SciLayer Systems (preprint).",
    "Why this supports exceptional ability: Demonstrates cross-program synthesis—transferring world-model abstractions, Gaussian spatial fields, and scientific-reasoning loops from robotics and ARC research into a novel continuous 2D RTS domain—with open code, a SciLayer preprint, and a competition-ready Kaggle submission (`phase4 nfm-asra-atlas v1`).",
  ],
  bullets: [
    "Modules: world_model.py (NFM + Atlas-GS value field), asra_reasoner.py, geometry.py, simulation.py, agent.py",
    "Five hypotheses per turn × 15-turn forward simulation → best-supported policy cluster",
    "Phase 4 on GitHub: https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase4",
    "SciLayer preprint: https://sci-layer.vercel.app/articles/orbit-wars-nfm-asra-atlas-phase-4",
  ],
  links: withPortfolioLinks([
    {
      label: "Orbit Wars Phase 4 (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/orbit-wars-nfm-asra-atlas-phase-4",
    },
    {
      label: "Orbit Wars on GitHub",
      href: "https://github.com/ilakkmanoharan/orbit-wars",
    },
    {
      label: "Phase 4 agent code",
      href: "https://github.com/ilakkmanoharan/orbit-wars/tree/main/phase4",
    },
    {
      label: "Phase 4 design paper (source)",
      href: "https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase4/paper.md",
    },
    {
      label: "Orbit Wars on Kaggle",
      href: "https://www.kaggle.com/competitions/orbit-wars",
    },
    { label: "Nature Foundation Models (NFM page)", href: "/nfm" },
    { label: "ASRA page", href: "/asra" },
  ]),
  hashtags: [
    "#OrbitWars",
    "#NatureFoundationModels",
    "#ASRA",
    "#AtlasGS",
    "#Kaggle",
    "#GameAI",
  ],
};
