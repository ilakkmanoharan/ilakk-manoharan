---
slug: ilakk-manoharan-portfolio
title: Ilakk Manoharan Portfolio
description: "Production portfolio and founder showcase that doubles as an agent-native platform—human visitors get projects, recruiting, and scheduling; other AI agents get a grounded representative with citations, REST, and MCP."
role: "Solo builder — Next.js app, Prisma/Turso data layer, content pipeline, recruiter portal, scheduling, admin dashboard, and Ilak's general-Agent1 (retrieval-first chat, REST query API, MCP server)"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/ilakk-manoharan"
websiteUrl: "https://ilakk-manoharan.vercel.app"
demoVideoUrl: ""
caseStudyUrl: "https://ilakk-manoharan.vercel.app/exceptional-ability"
filterTags: '["Full Stack","AI / ML","Backend","Cloud","Open Source","Distributed Systems"]'
techStack: '["Next.js 16","React 19","TypeScript","Tailwind CSS","Prisma","Turso","Vercel","MCP","Resend"]'
---

This repository powers my public portfolio at [ilakk-manoharan.vercel.app](https://ilakk-manoharan.vercel.app). It is not a static brochure—it is a **full-stack Next.js application** with content surfaces (projects, startups, hackathons, Founder Studio, skills, talks, exceptional-ability evidence), recruiter and hiring flows, contact and meeting requests, admin dashboard, and **Ilak's general-Agent1**.

## Two layers, one truth

1. **Traditional portfolio** — credibility, narrative, evidence cards, links to GitHub, SciLayer, patents, and Kaggle work.
2. **Programmable representative** — **Ilak's general-Agent1**, so any client (browser, REST, MCP) calls one shared retrieval brain and gets grounded answers with citations.

## Ilak's general-Agent1 — architecture

**Codename:** `general-agent-1` · **Public entry:** [/agent](https://ilakk-manoharan.vercel.app/agent) · **Manifest:** [/.well-known/agent.json](https://ilakk-manoharan.vercel.app/.well-known/agent.json)

Generic LLM chat on a portfolio **hallucinates** salary, visa status, and unreleased projects. This agent is the opposite: **retrieval before generation**, **refuse when uncertain**, **cite every factual claim**.

**Knowledge graph:** `content/agent/claims.json` and `knowledge-graph.json` sync at build time from projects, hackathons, startups, exceptional-ability evidence, SciLayer manuscripts, recruiter Q&A, and ASRA content (`npm run content:sync`). Each claim has `{ id, text, topics, sources, origin, verified }`.

**Runtime path:** question → `retrieveClaims()` (keyword scoring + approved conversation merge) → optional OpenAI paraphrase (off by default) → answer with source URLs. Low match → explicit refusal + Contact / Schedule pointers.

**Three surfaces, one brain:**

| Surface | Path | Purpose |
|---------|------|---------|
| Human chat | `/agent/g/{token}` | Invite-gated sessions with time budgets and citation chips |
| REST | `POST /api/agent/query` | Agent-to-agent queries with manifest discovery |
| MCP | `/api/mcp` | `search_facts`, `get_project`, `get_evidence`, `get_skills`, `get_availability` |

**Conversation workflow:** every exchange persists in Turso (`AgentInvite` → `AgentSession` → `AgentMessage`). Successful answers queue as `AgentKnowledgeCandidate` for admin review at `/admin/agent`; approved rows merge into live retrieval.

**Stack:** Next.js 16 App Router, Prisma 7 + Turso on Vercel, `@modelcontextprotocol/sdk`, Resend for meeting-request email, content-as-code under `content/`.

Built for recruiters and **agent-to-agent interviews**—the same grounded truth for humans and machines. Deep architecture write-up: Evidence 5 on [/exceptional-ability](https://ilakk-manoharan.vercel.app/exceptional-ability).
