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

/** Evidence 24 — CMB (Causal Memory Benchmark). */
export const cmbEvidenceSection: ExceptionalAbilitySection = {
  number: 24,
  title: "CMB — Causal Memory Benchmark",
  paragraphs: [
    "Most memory benchmarks ask whether a model can remember. I designed CMB (Causal Memory Benchmark) to ask a harder question: when an LLM must explain why its behavior, constraints, or reported internal states changed over a long session, which memory representation best preserves causal understanding—not just factual recall?",
    "The method holds the interaction trajectory fixed and varies only the memory format given before questioning: full history (gold), compressed summary (typical long-context compression), transition log (action → state change → effect, ASRA-style), or perturbation history (intervention → response → outcome). The same structured probe battery runs under every condition—attribution (why did state X change?), failure analysis, multi-intervention identification, and counterfactuals (what if intervention B had not occurred?).",
    "Scoring is against the trajectory log, not the model's self-summary. Decoy explanations (ASDB-style) block curve-fitting on plausible non-causal stories; held-out intervention types test whether transition-log memory generalizes the representation or only memorizes templates.",
    "Why this supports exceptional ability: Foundational eval design connecting ASRA transition memory, agent welfare introspection, and production agent architecture—CMB explains why compressed chat history destroys intervention chains, and motivates the layered data-layer memory I ship in Hire My Agents.",
  ],
  bullets: [
    "Four memory conditions on the same trajectory — isolate memory format as the variable",
    "Structured probes: attribution, failure, intervention ID, counterfactual",
    "Decoy explanations + held-out intervention types for generalization",
    "Pairs with WMIB (Evidence 25): memory mechanism → prerelease self-monitoring",
  ],
  links: withPortfolioLinks([
    { label: "CMB on Projects", href: "/projects#cmb" },
    {
      label: "Context as a data layer (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/agent-context-as-a-data-layer",
    },
    {
      label: "Transition-centric memory (ASRA Phase 1)",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
    },
    {
      label: "ASDB preprint (eval discipline)",
      href: "https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb",
    },
    { label: "WMIB (Evidence 25)", href: "/projects#wmib" },
    { label: "Hire My Agents", href: "/hire-my-agents" },
  ]),
  hashtags: ["#CMB", "#AgentMemory", "#CausalReasoning", "#ASRA", "#AgentEvals"],
};
