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

/** Evidence 27 — ASRA-LoRA synthetic datasets & Qwen2.5 LoRA pipeline. */
export const asraLoraEvidenceSection: ExceptionalAbilitySection = {
  number: 27,
  title: "ASRA-LoRA — synthetic reasoning datasets & Qwen2.5 adapter pipeline",
  paragraphs: [
    "I built ASRA-LoRA to answer whether adaptive reasoning can be learned from synthetic traces rather than solution-only supervision. The project ships 242,247 supervised fine-tuning rows across seven corpora—action-effect classification, next-action recommendation, failure→revision pairs, Kaggle submit post-mortems, Original ARC hypotheses and solutions, and full reasoning trajectories—mined from my ASRA transition logs, competition submission archives, and public ARC tasks.",
    "Each dataset is regenerated from open scripts (`scripts/build_datasets.py`), versioned in GitHub, and visualized in a public portfolio site with class-balance analytics, Kaggle score ladder, ARC before/after galleries, state and exploration graphs, and episode replay with a LoRA prediction overlay slot. This is demonstrable evidence—not a concept slide—that synthetic training data for scientific reasoning exists at production scale.",
    "The Qwen2.5-1.5B LoRA SFT pipeline (`train/hypothesis_lora_sft.py`) targets HypothesisLoRA first: action semantics and grid→hypothesis generation, designed to plug into the same ARC-AGI-3 competition agent as a reasoning module rather than a standalone solver. A SciLayer concept paper documents the modular adapter architecture (Hypothesis, Exploration, Failure, Trace LoRA) and the research question: can failure trajectories and hypothesis revisions improve reasoning adapters versus solution-only fine-tuning?",
    "Why this supports exceptional ability: End-to-end research engineering—dataset mining from a nine-phase cognitive stack, reproducible JSONL corpora, interactive evidence site, scholarly publication, and a concrete path to Qwen2.5 adapters integrated with live Kaggle competition infrastructure.",
  ],
  bullets: [
    "242,247 SFT rows · 7 datasets · open regeneration scripts",
    "D1 action-effect: 81,391 rows from ASRA transition JSONL",
    "D5/D6 Original ARC: 1,859 hypothesis + solution pairs each",
    "Portfolio visualizations: dashboard, ARC gallery, score ladder, graphs, replay",
    "SciLayer preprint + GitHub: ilakkmanoharan/ASRA-LoRA",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA-LoRA on Projects",
      href: "/projects/asra-lora",
    },
    {
      label: "Dataset portfolio (interactive)",
      href: "/asra-lora/index.html",
    },
    {
      label: "GitHub — ASRA-LoRA",
      href: "https://github.com/ilakkmanoharan/ASRA-LoRA",
    },
    {
      label: "SciLayer — ASRA-LoRA paper",
      href: "https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning",
    },
    {
      label: "ASRA on GitHub",
      href: "https://github.com/ilakkmanoharan/asra",
    },
    {
      label: "ARC Prize 2026 — ARC-AGI-3",
      href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    },
  ]),
  hashtags: ["#ASRALoRA", "#LoRA", "#Qwen", "#SyntheticData", "#ARC", "#ASRA", "#SciLayer"],
};
