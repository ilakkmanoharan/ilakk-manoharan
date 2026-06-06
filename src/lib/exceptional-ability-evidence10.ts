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

/** Evidence 10 — Portfolio site summary (see Evidence 5 for agent architecture depth). */
export const portfolioAgentEvidenceSection: ExceptionalAbilitySection = {
  number: 10,
  title: "Portfolio site — shipped product summary",
  paragraphs: [
    "The live portfolio at ilakk-manoharan.vercel.app ships filterable projects, startup catalog, hackathons, Founder Studio, skills, talks, exceptional-ability evidence, recruiter portal, Calendly scheduling, meeting requests, admin dashboard, and analytics—deployed from GitHub to Vercel with Turso (libSQL) for durable serverless writes.",
    "Evidence 5 documents the agent-native layer in depth: Ilak's general-Agent1 knowledge graph, retrieval-first policy, REST + MCP surfaces, conversation logging, and admin promotion workflow. This card summarizes the full product footprint for readers who want the site scope before the architecture detail.",
    "Why this supports exceptional ability: Demonstrates sustained full-stack product execution—content-as-code, production deploy discipline, and a portfolio that serves both human recruiters and machine clients from one repository.",
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
