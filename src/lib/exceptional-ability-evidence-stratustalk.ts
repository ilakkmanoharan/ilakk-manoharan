import type { ExceptionalAbilitySection } from "@/lib/exceptional-ability";

const portfolioNavLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Startup catalog", href: "/startups" },
  { label: "Professional experience", href: "/experience" },
];

function withPortfolioLinks(links: { label: string; href: string }[]) {
  const seen = new Set(links.map((l) => l.href));
  return [...links, ...portfolioNavLinks.filter((l) => !seen.has(l.href))];
}

/** Evidence 28 — StratusTalk Inc: synthetic dialogue SFT + LoRA for voice AI. */
export const stratustalkEvidenceSection: ExceptionalAbilitySection = {
  number: 28,
  title:
    "StratusTalk Inc — synthetic multi-turn dialogue datasets & LoRA adaptation for voice AI receptionists",
  paragraphs: [
    "At StratusTalk Inc I work as a contract Machine Learning Engineer on production voice AI receptionists that must follow a structured call policy—intent, messaging, transfer, confirm, close—rather than free-form chat. The exceptional work is the end-to-end learning loop: synthesizing multi-turn trajectories from production-like finite-state call graphs, packaging Unsloth-compatible ChatML, fine-tuning mid-size LLMs with LoRA, and evaluating next-action accuracy on held-out golden conversations so gains reflect generalization, not train contamination.",
    "I architected a Python CLI synthetic-data engine that traverses a JSON finite-state call graph with configurable happy-path / edge / failure mixtures and zero cross-scenario context leakage across business profiles. Each training turn pairs natural-language speech with a discrete `next_state` control signal—framing receptionist dialogue as supervised policy learning / structured prediction aligned with the live decision process.",
    "A key design choice was decoupling the controller (state-machine walk) from LLM verbalization: the SM owns every transition while models only produce speech (ReceptionistRPG-style generation). Combined with quota / stratified sampling over rare “golden hops” (transfer, take-message, confirm, after-hours), validation and rejection-sampling quality gates, Kubernetes generate/train jobs, and vLLM base-vs-adapter reporting, this is production ML systems engineering—not a notebook demo.",
    "Why this supports exceptional ability: Demonstrates original applied ML systems work spanning synthetic data design, train/serve alignment for policy-constrained dialogue, PEFT fine-tuning infrastructure, and rigorous holdout evaluation—shipped as architecture docs (v1/v2) and an active generate→train→eval pipeline for real voice agents.",
  ],
  bullets: [
    "Policy-constrained synthetic multi-turn trajectories over finite-state call graphs",
    "Controller vs verbalization decoupling for train/serve consistency",
    "Quota / stratified SM sampling + held-out golden sets (no train leakage)",
    "Validation / rejection-sampling gates → Unsloth LoRA (PEFT) → vLLM eval",
    "Kubernetes generate/train jobs with reproducible YAML configs",
  ],
  links: withPortfolioLinks([
    {
      label: "Professional experience — StratusTalk Inc",
      href: "/experience",
    },
    {
      label: "Dataset generation architecture (v1)",
      href: "/voxlayer/index.html",
    },
    {
      label: "Dataset generation architecture (v2 — shipped)",
      href: "/voxlayer-v2/index.html",
    },
    {
      label: "voxtune (GitHub)",
      href: "https://github.com/antillestech/voxtune",
    },
  ]),
  hashtags: [
    "#StratusTalk",
    "#LoRA",
    "#PEFT",
    "#SyntheticData",
    "#ConversationalAI",
    "#vLLM",
    "#Unsloth",
  ],
};
