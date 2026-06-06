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

/** Evidence 10 — Portfolio site and Ilak's general-Agent1. */
export const portfolioAgentEvidenceSection: ExceptionalAbilitySection = {
  number: 10,
  title:
    "Portfolio site & Ilak's general-Agent1 — agent-native full-stack platform",
  paragraphs: [
    "I designed, built, and deployed a production portfolio at ilakk-manoharan.vercel.app that is not a static brochure: it is a full-stack Next.js application with filterable projects, startup catalog, hackathons, Founder Studio, skills, talks, exceptional-ability evidence, recruiter portal, Calendly scheduling, meeting requests, admin dashboard, and analytics—deployed from GitHub to Vercel with Turso (libSQL) for durable serverless writes.",
    "Recruiters, collaborators, and other AI agents need different interfaces to the same truth about my work. Humans want a polished site and scheduling; interview agents need structured APIs, citations, and refusal behavior—not a chatbot that improvises salary, visa status, or unreleased projects.",
    "Ilak's general-Agent1 (codename general-agent-1) is the programmable representative layer: retrieval before generation, refuse when uncertain, cite every factual claim. Answers come from a claims graph synced from projects, exceptional-ability evidence, recruiter Q&A, and skills—not from model imagination. Human chat, REST, and MCP all call the same retrieveClaims() brain.",
    "Three shipped surfaces share one policy: invite-gated human chat at /agent/g/{token} with conversation budgets; POST /api/agent/query for agent-to-agent REST with manifest at /.well-known/agent.json; and a first-class MCP server at /api/mcp (search_facts, get_project, get_evidence, get_skills, get_availability) so Claude Desktop, Cursor, and evaluation agents connect without scraping HTML.",
    "Contribution: End-to-end product execution—custom admin for agent invites, Prisma session logging, Resend email on meeting requests, content-as-code under content/projects/, and anti-hallucination policy published in the manifest—built for agent-to-agent interviews (e.g. K-Dense-style evaluations) with verifiable source URLs on every answer.",
    "Why this supports exceptional ability: Demonstrates full-stack ownership at the intersection of product, distributed systems, and AI systems design—an agent-native portfolio where the same site serves humans and machines with grounded retrieval, not generic LLM chat.",
  ],
  bullets: [
    "Live portfolio: https://ilakk-manoharan.vercel.app · Source: https://github.com/ilakkmanoharan/ilakk-manoharan",
    "Ilak's general-Agent1: https://ilakk-manoharan.vercel.app/agent · Manifest: https://ilakk-manoharan.vercel.app/.well-known/agent.json · MCP: https://ilakk-manoharan.vercel.app/api/mcp",
    "Stack: Next.js 16 · React 19 · TypeScript · Prisma · Turso · @modelcontextprotocol/sdk · Resend",
    "Knowledge sync: content/agent/claims.json ← projects, evidence cards, recruiter Q&A (npm run agent:sync-knowledge)",
  ],
  links: withPortfolioLinks([
    {
      label: "Live portfolio",
      href: "https://ilakk-manoharan.vercel.app",
    },
    {
      label: "Portfolio on GitHub",
      href: "https://github.com/ilakkmanoharan/ilakk-manoharan",
    },
    {
      label: "Ilak's general-Agent1",
      href: "https://ilakk-manoharan.vercel.app/agent",
    },
    {
      label: "Agent manifest",
      href: "https://ilakk-manoharan.vercel.app/.well-known/agent.json",
    },
    {
      label: "MCP endpoint",
      href: "https://ilakk-manoharan.vercel.app/api/mcp",
    },
    {
      label: "Schedule",
      href: "https://ilakk-manoharan.vercel.app/schedule",
    },
    {
      label: "Recruiter portal",
      href: "https://ilakk-manoharan.vercel.app/recruiter",
    },
  ]),
  hashtags: [
    "#portfolio",
    "#agents",
    "#MCP",
    "#NextJS",
    "#FullStack",
  ],
};
