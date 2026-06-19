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

/** Evidence 21 — NeuroGolf remote submission pipeline (GitHub Actions). */
export const neurogolfCicdEvidenceSection: ExceptionalAbilitySection = {
  number: 21,
  title:
    "NeuroGolf 2026 — remote ML competition pipeline (GitHub Actions)",
  paragraphs: [
    "For NeuroGolf 2026, each full ARC-Genome submission validates 400 ONNX circuits against ARC-GEN generalization gates and Kaggle’s official cost formula. A complete run takes about 75–90 minutes and peaks at 2–4 GB RAM during ONNX profiling — enough to block a laptop for a full workday if run locally every iteration.",
    "I built a GitHub Actions pipeline that runs the entire workflow on cloud runners: solve, audit, zip, conditional Kaggle submit, log fetch, and a dated submission registry. I design solvers and theory locally; the infrastructure handles reproducible execution, artifact retention, and incremental seeding from prior submissions. That split freed my machine for research while keeping every run auditable.",
    "The payoff was time and throughput, not automation for its own sake. Zero local RAM for full solves; documented submission progression from 64 to 70 pass_all tasks with estimated scores moving from ~835 toward ~905 (June 2026). I could iterate on algorithm design daily without tying up local compute or risking environment drift between runs.",
    "Why this supports exceptional ability: Treats a Kaggle competition as version-controlled ML infrastructure — gated deploys, secrets hygiene, cached validation data, and a submission ledger — the same discipline I would apply to production ML delivery, not a one-off notebook submit.",
  ],
  bullets: [
    "NeuroGolf 2026: ~75–90 min full pipeline offloaded from local machine",
    "400 tasks × ARC-GEN gate per run; conditional Kaggle submit on improvement",
    "Submission registry + artifacts (logs, audit JSON) for reproducibility",
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
      label: "Evidence 20 — ARC-Genome (same repo)",
      href: "https://github.com/ilakkmanoharan/ARC-NeuroGolf",
    },
    { label: "Projects page", href: "/projects" },
  ]),
  hashtags: [
    "#NeuroGolf",
    "#ARCGenome",
    "#GitHubActions",
    "#MLOps",
    "#Kaggle",
  ],
};
