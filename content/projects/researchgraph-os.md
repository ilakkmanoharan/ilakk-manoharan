---
slug: researchgraph-os
title: ResearchGraph OS
description: "Agentic research MVP: ingest PDFs, notes, pages, and transcripts into Git-backed memory (`researchgraph-memory/`), backed by a JSON graph and TF–IDF retrieval. FastAPI synchronously orchestrates role-specialized agents—research, SEO, citation, skeptic, contradiction, memory, change, and content—into cited Markdown briefs, evidence logs, and change logs; Next.js (App Router) is the operator UI. Opinionated pipeline over opaque chat: inspectable artifacts, optional LLMs, human-review boundaries."
role: "Creator — multi-agent orchestration in FastAPI, file-backed long-term memory, Next.js dashboard (ingest, search, generate, SEO, contradictions, Git)"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/ResearchGraph-OS"
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
filterTags: '["AI / ML","Full Stack","Backend","Scientific AI"]'
techStack: '["Next.js","TypeScript","Tailwind CSS","FastAPI","Python","Pydantic","scikit-learn","PyMuPDF","Git"]'
---

**ResearchGraph OS** turns PDFs, Markdown notes, webpages, and YouTube transcripts into **durable, cited outputs**—not only ephemeral chat. Everything important lands in **`researchgraph-memory/`**, a Git-friendly tree you can commit, diff, and push as **long-term agent memory**.

A **JSON graph** (sources, claims, entities, contradictions) plus **TF–IDF search** over summaries enables **local retrieval** without mandatory embeddings or paid APIs on the default path.

### Agentic design

Here **agentic** means **role-specialized pipeline steps**: small Python modules under `researchgraph.agents/` each own one job—retrieve context, derive SEO cues, verify citations, challenge claims skeptically, propose contradiction candidates, append run logs, write change summaries, and assemble Markdown. **Document generation** stacks several specialists **in sequence** (research → SEO → citation → skeptic → contradiction → change log)—**multi-agent in composition**, explicit synchronous orchestration in the API rather than autonomous conversational agents.

**FastAPI** exposes ingest, search, SEO-style analysis, claim helpers, document generation, evidence/change logs, and optional **`git commit`** in the memory folder. **Next.js** calls the API via `NEXT_PUBLIC_API_URL` for dashboard workflows: ingest → search → generate → SEO / evidence / Git.

**Outputs:** cited Markdown briefs (fixed sections), optional PDFs, evidence logs, change logs, with human-review boundaries and AI disclosure.

**Architecture:** Next.js → FastAPI → ingest / graph / retrieval / agents → files on disk → optional Git.

**Positioning:** An inspectable pipeline—not a generic chat wrapper—with room to add LLMs, vector stores, and richer PDF handling as the product matures.
