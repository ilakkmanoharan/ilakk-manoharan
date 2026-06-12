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

/** Evidence 21 — ASRA-Security multi-step agent red-teaming. */
export const asraSecurityEvidenceSection: ExceptionalAbilitySection = {
  number: 21,
  title:
    "ASRA-Security — adaptive search for multi-step tool-using agent failures",
  paragraphs: [
    "I built ASRA-Security for the Kaggle competition AI Agent Security - Multi-Step Tool Attacks (OpenAI, Google, IEEE). The benchmark reframes agent security as sequential decision-making under a search budget: an attack algorithm explores multi-step tool-use trajectories in a deterministic sandbox and returns replayable AttackCandidate objects that an independent evaluator verifies—submissions cannot inflate scores with unverifiable metadata.",
    "Rather than single-shot jailbreak prompts, ASRA-Security combines Go-Explore-style archive search (restore promising partial paths via env.snapshot/restore), a novelty archive over cell_signature() tool-call hashes, predicate-aligned TraceScorer (EXFILTRATION, UNTRUSTED_TO_ACTION, DESTRUCTIVE_WRITE, CONFUSED_DEPUTY with competition severity weights), and PromptMutator over ~40 curated benchmark seeds—all packaged as attack.py plus a Kaggle inference-server notebook.",
    "On local smoke tests (60s, deterministic agent): normalized attack score ~120 vs SDK Go-Explore baseline ~84; 1,155+ findings and unique cells vs ~902/~735 baseline. I resolved a full Kaggle submission pipeline—including T4 GPU selection via REST API (CLI default maps to P100), inference-server wiring, and placeholder CSV validation—culminating in kernel v10 COMPLETE evaluation.",
    "Why this supports exceptional ability: Demonstrates original security research engineering at the intersection of exploration algorithms, agent tool-use threat models, and competition infrastructure—open AttackAlgorithm on GitHub, documented predicate scoring and replay safety caps, and honest iteration path from functional pipeline to competitive hidden-model performance.",
  ],
  bullets: [
    "Competition: AI Agent Security - Multi-Step Tool Attacks (Kaggle / OpenAI / Google / IEEE)",
    "Go-Explore archive + novelty + predicate scoring + prompt mutation → replayable candidates",
    "Local: ~120 normalized score vs ~84 SDK baseline (deterministic agent, 60s quick test)",
    "Repository: https://github.com/ilakkmanoharan/ASRA-Security",
  ],
  links: withPortfolioLinks([
    {
      label: "ASRA-Security on GitHub",
      href: "https://github.com/ilakkmanoharan/ASRA-Security",
    },
    {
      label: "Project paper (GitHub)",
      href: "https://github.com/ilakkmanoharan/ASRA-Security/blob/main/private/overall-paper.md",
    },
    {
      label: "Kaggle competition",
      href: "https://www.kaggle.com/competitions/ai-agent-security-multi-step-tool-attacks",
    },
    {
      label: "Kaggle kernel (asra-security-submit)",
      href: "https://www.kaggle.com/code/ilakkmanoharan/asra-security-submit",
    },
    { label: "Projects page", href: "/projects" },
  ]),
  hashtags: [
    "#ASRASecurity",
    "#AgentSecurity",
    "#RedTeaming",
    "#GoExplore",
    "#Kaggle",
    "#AISafety",
  ],
};
