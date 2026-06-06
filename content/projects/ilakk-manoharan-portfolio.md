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
caseStudyUrl: ""
filterTags: '["Full Stack","AI / ML","Backend","Cloud","Open Source"]'
techStack: '["Next.js 16","React 19","TypeScript","Tailwind CSS","Prisma","Turso","Vercel","MCP","Resend"]'
---

This repository powers my public portfolio at [ilakk-manoharan.vercel.app](https://ilakk-manoharan.vercel.app). It is not a static brochure—it is a **full-stack Next.js application** with content surfaces (projects, startups, hackathons, Founder Studio, skills, talks, exceptional-ability evidence), recruiter and hiring flows, contact and meeting requests, admin dashboard, and **Ilak's general-Agent1**.

**Ilak's general-Agent1** (`general-agent-1`) is a retrieval-first AI representative: answers come from a claims graph (`content/agent/claims.json`), every factual reply cites a source URL, and low-confidence questions get an explicit refusal—not improvised salary, visa, or unreleased work.

Three surfaces share one brain:

- **Human chat** — [/agent](https://ilakk-manoharan.vercel.app/agent) (public info) and invite-gated `/agent/g/{token}` sessions with time budgets
- **REST** — `POST /api/agent/query` with manifest at [/.well-known/agent.json](https://ilakk-manoharan.vercel.app/.well-known/agent.json)
- **MCP** — [Streamable HTTP at /api/mcp](https://ilakk-manoharan.vercel.app/api/mcp) with `search_facts`, `get_project`, `get_evidence`, `get_skills`, and `get_availability`

Production stack: **Next.js 16 App Router**, **Prisma 7** with Turso (libSQL) on Vercel, **Resend** for meeting-request email, content-as-code under `content/projects/`, and middleware-protected `/admin` for submissions and agent invites.

Built for recruiters and **agent-to-agent interviews**—the same grounded truth for humans and machines.
