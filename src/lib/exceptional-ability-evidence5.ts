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

/** Evidence 5 — Portfolio platform & Ilak's general-Agent1 architecture. */
export const portfolioAgentArchitectureEvidenceSection: ExceptionalAbilitySection =
  {
    number: 5,
    title:
      "Portfolio platform & Ilak's general-Agent1 — what I built and how it works",
    paragraphs: [
      "I designed, built, and deployed ilakk-manoharan.vercel.app myself—not as a static portfolio, but as a production Next.js app that has to work for two very different audiences. Recruiters need projects, scheduling, and evidence they can skim in a browser. Other AI agents need the same verified facts through an API or MCP. That tension is what pushed me to build Ilak's general-Agent1 on top of the site.",
      "The core idea is straightforward: every factual answer has to come from content I actually wrote and checked in git—not from model improvisation. I keep projects, hackathons, startups, skills, exceptional-ability evidence, SciLayer manuscripts, recruiter Q&A, and ASRA work in markdown and TypeScript under content/. At build time, a sync step compiles those sources into a claims graph. At runtime, one function—retrieveClaims()—scores a question against that graph and returns matching claims with source URLs. The browser chat, the REST query API, and the MCP server all call that same function. If the match is weak, the agent refuses and points to Contact or Schedule instead of guessing.",
      "On the product side, I shipped the full recruiter loop: filterable project pages, startup catalog, hackathons, Founder Studio, skills, talks, this evidence page, recruiter chat backed by a fixed markdown brief, message forms, Calendly scheduling, admin dashboards, and invite-gated agent sessions with time budgets. Every agent conversation is logged in Prisma on Turso—invite, session, message, citations—so I can review what was asked and, when appropriate, promote vetted Q&A into the live knowledge graph after admin approval.",
      "For agent-to-agent use, I published a manifest, a POST query API, and a Streamable HTTP MCP server using the @modelcontextprotocol/sdk. Tools like search_facts, get_project, get_evidence, and get_skills all require a valid invite token—the same policy as the human chat UI. I also added narrative answer composition for ASRA and ARC questions so multi-step research answers read in order instead of as a pile of fragments. Optional OpenAI paraphrase exists, but it only runs after successful retrieval and is off by default.",
      "I built this with Next.js 16, React 19, TypeScript, Tailwind, Prisma, Turso, Vercel, Resend for email, and the MCP SDK. Content lives in the repo; npm run content:sync rebuilds the knowledge graph on every deploy. The point wasn't to bolt a chatbot onto a résumé—it was to own the full stack from content pipeline to session logging to a refusal-first agent other systems can actually interview.",
      "Why this supports exceptional ability: I shipped a live product where humans and machines read the same verified corpus, with citations and explicit refusal when I'm not confident—full-stack product work at the intersection of distributed systems, content engineering, and agent-native AI design.",
    ],
    bullets: [
      "Solo-built and deployed the portfolio at ilakk-manoharan.vercel.app from GitHub to Vercel",
      "One retrieval brain shared by invite-gated chat, REST query API, and MCP—no separate prompt hacks per surface",
      "Git-backed claims graph synced from all site content on every build; admin can promote reviewed conversation answers",
      "Session logging end-to-end: invite → session → message with citation JSON stored in Turso",
      "Stack: Next.js 16, React 19, TypeScript, Prisma, Turso, MCP SDK, Resend",
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
        label: "Exceptional ability",
        href: "https://ilakk-manoharan.vercel.app/exceptional-ability",
      },
    ]),
    hashtags: [
      "#portfolio",
      "#agents",
      "#MCP",
      "#knowledgegraph",
      "#NextJS",
      "#FullStack",
    ],
  };
