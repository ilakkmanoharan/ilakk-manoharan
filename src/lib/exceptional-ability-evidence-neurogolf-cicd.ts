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

/** Evidence 21 — NeuroGolf remote competition automation (Cursor cloud + GHA). */
export const neurogolfCicdEvidenceSection: ExceptionalAbilitySection = {
  number: 21,
  title:
    "NeuroGolf 2026 — remote competition automation (Cursor cloud + GitHub Actions)",
  paragraphs: [
    "For NeuroGolf 2026, each ARC-Genome submission validates 400 ONNX circuits against ARC-GEN generalization and Kaggle’s official cost formula. A full solve takes about 75–90 minutes and peaks at 2–4 GB RAM during ONNX profiling — enough to block a laptop for a full work session if run locally every iteration.",
    "I built a closed-loop automation system on Cursor cloud agents — four chained automations that run the full Kaggle cycle without human intervention: solve and conditional submit (~90 min), fetch official grades and per-task logs, analyze results and implement the next solver, and publish a submission report to a gallery. Each step commits to GitHub and triggers the next via guard rules. My laptop can be closed; research judgment stays human, machine execution stays remote.",
    "GitHub Actions workflows are the backup when a solve exceeds Cursor’s runtime limit — same solve-audit-submit path on a longer-timeout runner. Every run keeps a dated submission folder, registry row, logs, and audit JSON so the loop is reproducible, not a one-off notebook submit.",
    "The payoff was time and throughput. Zero local RAM for full solves; documented progression from 64 to 70 pass_all tasks with Kaggle scores moving from ~835 toward 915 on submission-4 (June 2026). I could iterate on algorithm design daily without tying up local compute or drifting environments between runs.",
    "Why this supports exceptional ability: Treats a solo Kaggle competition as version-controlled ML operations — gated submits, secrets hygiene, chained automations, and a submission ledger — the same discipline applied to production ML delivery.",
  ],
  bullets: [
    "Four Cursor cloud automations: solve → fetch logs → analyze + implement → publish (loop closes on main)",
    "~75–90 min full solve offloaded; GHA fallback for long runs",
    "Conditional Kaggle submit only on pass_all or score improvement; 400 tasks × ARC-GEN gate",
    "Submission registry + gallery + artifacts (logs, audit JSON) per run",
    "Repository: https://github.com/ilakkmanoharan/ARC-NeuroGolf",
  ],
  links: withPortfolioLinks([
    {
      label: "ARC-NeuroGolf on GitHub",
      href: "https://github.com/ilakkmanoharan/ARC-NeuroGolf",
    },
    {
      label: "NeuroGolf 2026 on Kaggle",
      href: "https://www.kaggle.com/competitions/neurogolf-2026",
    },
    {
      label: "Evidence 20 — ARC-Genome compiler (same repo)",
      href: "https://github.com/ilakkmanoharan/ARC-NeuroGolf",
    },
    { label: "Projects page", href: "/projects" },
  ]),
  hashtags: [
    "#NeuroGolf",
    "#ARCGenome",
    "#Cursor",
    "#GitHubActions",
    "#MLOps",
    "#Kaggle",
  ],
};
