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
      "Portfolio platform & Ilak's general-Agent1 — retrieval-first agent architecture",
    paragraphs: [
      "I designed, built, and deployed ilakk-manoharan.vercel.app as a full-stack Next.js platform—not a static brochure. Humans get projects, recruiting, scheduling, and evidence cards; other AI agents get the same grounded truth through REST and MCP. Recruiters and interview agents need different interfaces to one corpus of verified facts, not a chatbot that improvises salary, visa status, or unreleased work.",
      "Ilak's general-Agent1 (codename general-agent-1) is the programmable representative layer: retrieval before generation, refuse when uncertain, cite every factual claim. Answers come from a git-backed knowledge graph (content/agent/claims.json + knowledge-graph.json) synced from projects, exceptional-ability evidence, hackathons, startups, SciLayer manuscripts, recruiter Q&A, and ASRA content—not from model imagination.",
      "Architecture: content sources → sync-knowledge.ts at build time → claims graph → retrieveClaims() at runtime → three surfaces sharing one brain: invite-gated human chat (/agent/g/{token}), POST /api/agent/query with manifest at /.well-known/agent.json, and Streamable HTTP MCP at /api/mcp (search_facts, get_project, get_evidence, get_skills, get_availability). Optional OpenAI paraphrase (Mode B) runs only after successful claim retrieval and is off by default.",
      "Knowledge graph workflow: npm run content:sync rebuilds claims from all site content; npm run agent:fetch-scilayer mirrors SciLayer articles; approved agent conversations queue as AgentKnowledgeCandidate rows in Turso and merge into live retrieval after admin review at /admin/agent. Every non-refused chat exchange persists in Prisma (AgentInvite → AgentSession → AgentMessage) with citation JSON.",
      "Anti-hallucination policy (published in the manifest and chat UI): answer only from synced content; cite source URLs; refuse below match threshold; never infer salary, visa, or unreleased work without an explicit claim. Built for agent-to-agent interviews—K-Dense-style evaluations connect via MCP or REST and receive verifiable answers with links, not invented prose.",
      "Contribution: End-to-end AI systems product execution—@modelcontextprotocol/sdk MCP server, shared retrieveClaims() across UI/API/MCP, narrative answer composition for ASRA/ARC questions, Prisma + Turso session logging, admin invite budgets, and content-as-code under content/projects/ with build-time knowledge sync on every deploy.",
      "Why this supports exceptional ability: Demonstrates full-stack ownership at the intersection of product engineering, distributed systems, and agent-native AI design—a production portfolio where humans and machines read the same verified knowledge graph with refusal and citations, not generic LLM chat.",
    ],
    bullets: [
      "Live: https://ilakk-manoharan.vercel.app · Source: https://github.com/ilakkmanoharan/ilakk-manoharan",
      "Agent: https://ilakk-manoharan.vercel.app/agent · Manifest: https://ilakk-manoharan.vercel.app/.well-known/agent.json · MCP: https://ilakk-manoharan.vercel.app/api/mcp",
      "Knowledge sync: content/projects, hackathons, startups, exceptional-ability, SciLayer, recruiter Q&A → claims.json (npm run content:sync)",
      "Stack: Next.js 16 · React 19 · TypeScript · Prisma · Turso · MCP SDK · Resend",
      "Phases shipped: claims + query API + invites + MCP + conversation export + admin knowledge promotion",
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
