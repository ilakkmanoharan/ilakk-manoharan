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

/** Evidence 23 — ASDB (Adaptive Scientific Discovery Benchmark). */
export const asdbEvidenceSection: ExceptionalAbilitySection = {
  number: 23,
  title: "ASDB — Adaptive Scientific Discovery Benchmark",
  paragraphs: [
    "I designed ASDB (Adaptive Scientific Discovery Benchmark) to answer a question most agent benchmarks skip: can a system learn what interventions do from state transitions, then use that knowledge to infer hidden mechanisms and predict held-out observables—without documented tool schemas or curve-fitting on surface patterns?",
    "ASDB decomposes evaluation into two scored constructs in one harness. Track A (Action Semantics Discovery) grades recovery of an action map φ̂(a) from unlabeled controls—what each abstract action does, inferred only from (state, action, next_state) transitions. Track B (Scientific Discovery Evaluation) grades mechanism class and held-out predictive accuracy under a fixed intervention budget. Linked A→B episodes separate semantics failure from theory failure: an agent can pass tool-learning and still submit the wrong hidden law.",
    "The framework specifies intervention-centric metrics, tiered difficulty (independent → compositional → context-dependent actions; unique ground truth → decoy theories → scale hierarchy), decoy hypotheses to block curve-fitting, and full trajectory audit logs—ground truth is the evaluator's log, not the model's recap.",
    "Why this supports exceptional ability: Original benchmark architecture at the intersection of scientific reasoning, interactive agents, and construct-valid evaluation—published on SciLayer, integrated with the nine-phase ASRA stack, and applied as the eval discipline behind Hire My Agents (measure before you scale).",
  ],
  bullets: [
    "Track A: unlabeled action semantics from transitions",
    "Track B: hidden mechanism + held-out prediction under intervention budget",
    "A→B episodes: separate tool-learning from theory-learning",
    "SciLayer preprint: https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb",
  ],
  links: withPortfolioLinks([
    {
      label: "SciLayer — ASDB preprint",
      href: "https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb",
    },
    {
      label: "Action semantics in ASRA (SciLayer)",
      href: "https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra",
    },
    {
      label: "ASRA on GitHub",
      href: "https://github.com/ilakkmanoharan/asra",
    },
    { label: "ASDB on Projects", href: "/projects#asdb" },
    { label: "Hire My Agents", href: "/hire-my-agents" },
  ]),
  hashtags: ["#ASDB", "#AgentEvals", "#ScientificAI", "#ASRA", "#SciLayer"],
};
