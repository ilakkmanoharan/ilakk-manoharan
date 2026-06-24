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

/** Evidence 26 — Hire My Agents AI workforce platform. */
export const hireMyAgentsEvidenceSection: ExceptionalAbilitySection = {
  number: 26,
  title: "Hire My Agents — AI workforce with jobs, reports, and accountability",
  paragraphs: [
    "Hire My Agents is an AI-native workforce platform I am building end-to-end: users hire specialized agents (personal assistant, backend engineer, recruiter, research scientist, PR manager, finance, AI security, red team) for real work—not open-ended chat. Each agent has an avatar, memory, tools, workflows, and daily reporting; sensitive actions require approval before anything public goes live.",
    "The product discipline is jobs, reports, and accountability. Agents scope work in conversation, connect tools (GitHub, calendars, research APIs, social platforms), run workflows in the cloud, coordinate in teams, and send daily email reports and SMS updates. I introduced the platform at the Naperville AI Enthusiasts meetup (Jun 22, 2026) with a live talk on why most agents fail on long-running work and what makes these workers different.",
    "Memory is a layered data infrastructure—not chat history. Personal Brain and Company Brain store events, structured facts, vector retrieval, live project state, and transition memory (what action changed what state). I published the architecture on SciLayer as Agent Context as a Data Layer: Beyond Chat History and RAG, arguing that the context window is working memory and durable state lives outside the model in logs, databases, and retrieval systems the agent pulls from at runtime.",
    "The eval stack (ASDB, CMB, WMIB) is not separate from the product—it is how I refuse to scale on vibes. Measure semantics learning and theory discrimination (ASDB), causal memory under compression (CMB), and self-monitoring under intervention and stress (WMIB) before handing agents real money, reputation, and production tools.",
    "Why this supports exceptional ability: Original product architecture, shipped landing page and portfolio integration, public talk with recording, SciLayer scholarly preprint, and a coherent research-to-product line from ASRA transition logging through eval benchmarks to deployable AI workers.",
  ],
  bullets: [
    "Landing page: https://ilakk-manoharan.vercel.app/hire-my-agents",
    "Roster: Tiffany (backend), Crystal (assistant), Ava (PR), Sophia (research), Raven (red team), Sentinel (security), and more",
    "Memory: Personal Brain + Company Brain; context as data layer (not chat transcript)",
    "Talk: Naperville AI Enthusiasts meetup — Jun 22, 2026 (recording on Talks page)",
  ],
  links: withPortfolioLinks([
    { label: "Hire My Agents landing page", href: "/hire-my-agents" },
    { label: "Startup catalog", href: "/startups" },
    {
      label: "SciLayer — context as a data layer",
      href: "https://sci-layer.vercel.app/articles/agent-context-as-a-data-layer",
    },
    { label: "Talk recording", href: "/talks/naperville-ai-meetup-2026/recording.mp4" },
    { label: "Talks page", href: "/talks" },
    { label: "Hire My Agents on Projects", href: "/projects#hire-my-agents" },
    { label: "ASDB (Evidence 23)", href: "/projects#asdb" },
    { label: "CMB (Evidence 24)", href: "/projects#cmb" },
    { label: "WMIB (Evidence 25)", href: "/projects#wmib" },
  ]),
  hashtags: [
    "#HireMyAgents",
    "#AIAgents",
    "#AgentMemory",
    "#BuildInPublic",
    "#SciLayer",
  ],
};
