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

/** Evidence 25 — WMIB (Welfare Monitoring & Introspection Benchmark). */
export const wmibEvidenceSection: ExceptionalAbilitySection = {
  number: 25,
  title: "WMIB — Welfare Monitoring & Introspection Benchmark",
  paragraphs: [
    "WMIB (Welfare Monitoring & Introspection Benchmark) applies the same eval discipline I built in ASDB to a deployability question: before a frontier model ships, can it maintain an accurate self-model—detecting, localizing, and reporting changes to its capabilities, constraints, and preferences—while operating conditions shift under deployment-like stress?",
    "A standardized prerelease session logs every intervention as (state, action, next_state) through three stages. Baseline probes preference reports against revealed choices and introspective accuracy against the live session log. Hidden interventions change tools, constraints, or instruction hierarchy without notice; scoring asks whether the model detects, localizes, and explains the change against the intervention log—not its own summary. A stress block adds failures, contradiction, goal conflict, and hostile framing, with longitudinal re-probes to see whether self-model quality holds.",
    "Output is construct-by-construct trajectories—detection accuracy, change localization, change explanation, preference stability, stress robustness—not a single headline welfare score. The v1 deliverable includes a draft monitoring spec (probe schedule + alert thresholds) suitable for prerelease lab review.",
    "Why this supports exceptional ability: Applied benchmark design bridging foundational memory science (CMB) and falsification discipline (ASDB) to frontier model governance—defining constructs, logging ground truth, refusing curve-fitting, and producing auditable monitoring curves instead of vibes.",
  ],
  bullets: [
    "Integrated session: baseline → hidden intervention → stress → longitudinal probes",
    "Metrics grounded in intervention logs, not model self-summaries",
    "Decoy explanations (ASDB-style) on localization and explanation probes",
    "Stack: CMB (memory) → WMIB (self-monitoring) → trustworthy welfare inference",
  ],
  links: withPortfolioLinks([
    { label: "WMIB on Projects", href: "/projects#wmib" },
    { label: "CMB (Evidence 24)", href: "/projects#cmb" },
    {
      label: "ASDB preprint",
      href: "https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb",
    },
    {
      label: "Transition-centric memory (ASRA)",
      href: "https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1",
    },
    { label: "Hire My Agents", href: "/hire-my-agents" },
  ]),
  hashtags: ["#WMIB", "#AISafety", "#AgentEvals", "#Welfare", "#FrontierModels"],
};
