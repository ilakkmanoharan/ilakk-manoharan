# Agent Context as a Data Layer: Beyond Chat History and RAG

**Author:** Ilakkuvaselvi Manoharan  
**Affiliation:** Hire My Agents · Nature Foundation Models  
**Date:** June 2026  
**Version:** 1.0 — SciLayer concept paper

---

## Abstract

Most production AI agents still treat **context** as one artifact: the conversation so far. Messages accumulate; long threads are summarized; when summaries lose detail, teams buy larger context windows. That contract works for short demos. It fails for workers that run jobs for days—calling tools, logging outcomes, and reporting back on what actually ran.

This paper proposes an architectural alternative: **context as a data layer**. The model's context window functions as **working memory**—what the model reasons on right now. Durable context lives **outside** the model in layered stores: raw events, structured facts, vector retrieval, live project state, and **transition memory** (action → state change → outcome). Retrieval-augmented generation (RAG) is one component of this stack, not the whole system.

We describe five storage layers, explain how dynamic retrieval reduces **context sensitivity** and **context amnesia**, and contrast narrative summaries with experiment logs for causal audit. The design is implemented in **Hire My Agents**, a workforce platform where users hire agents for scoped jobs with approval gates and step logs—not open-ended chat sessions.

---

## 1. Introduction

When people say an agent "remembers," they often mean the model can see prior chat turns. That is a fragile definition of memory. Chat history grows unbounded; summarization destroys timing and causal links; rephrasing a question can change behavior entirely. Meanwhile, production agents must answer a harder question: *what happened, what did we decide, and which action caused which outcome?*

A human employee does not rely on verbatim recall of every spoken sentence. They open systems of record: CRM entries, ticket queues, project trackers, run logs. Agent architecture should mirror that pattern. The language model provides **behavior**—reasoning, tone, format. The **data layer** provides memory you can audit.

This concept paper synthesizes design principles used in Hire My Agents and connects them to transition-centric memory research in ASRA: compress **experiments**, not mere **observations**; retrieve task-sized context at runtime; treat tools and databases as sources of truth.

---

## 2. Failure modes of chat-as-memory

Three failure modes recur in production agent deployments:

### 2.1 Context amnesia

The user agrees on a plan. The thread grows long, or older messages are summarized away. Minutes later the agent pursues a different goal. Or it remembers that a metric moved—but not which workflow run or query produced the number.

### 2.2 Context sensitivity

Small changes in wording, instruction order, or tone produce different answers from the same agent. That is not reliability; it is sensitivity to prompt framing.

### 2.3 No audit trail

The agent states a confident conclusion. Nothing in the system records which documents were retrieved, which tools executed, or which project state was assumed. Evaluators grade narrative, not work.

**Root cause:** the only durable memory is the latest prompt assembly.

---

## 3. Working memory vs long-term memory

| Layer | Role | Analogy |
|-------|------|---------|
| Model context window | What the model reasons on *now* | Working memory |
| Data layer | What persists across sessions, jobs, tools | Long-term memory |

Enlarging the context window only expands working memory. It does not reliably answer:

- What was decided?
- What changed?
- What failed?
- What is still open?
- What did the user prefer?
- What should never be repeated?

Long-term memory resides in logs, databases, and retrieval systems the agent consults **before** acting.

---

## 4. Five layers of context storage

For each agent, context is not a single blob. It is **layered**:

### 4.1 Raw events

Every message, tool call, file update, decision, result, error, and user correction—ground truth of what happened, in order.

### 4.2 Structured memory

Facts extracted from events: goals, preferences, projects, constraints, people, deadlines, decisions. Machine-readable state, not prose.

```text
deadline = June 30
project   = backend migration
status    = blocked on API access
priority  = urgent
```

### 4.3 Vector memory

Embeddings of documents, notes, code, and emails for **semantic retrieval**—finding material similar to the current question.

### 4.4 State memory

What the agent is working on *now*: active task, plan, next step, blockers, open questions.

### 4.5 Transition memory (causal)

What **action** changed what **state**, and what **outcome** followed:

```text
action → state change → observed result
```

This is **experiment memory**, not observation memory. It supports answers to *why* something changed—not only *that* it changed.

---

## 5. RAG is one part, not the whole system

Retrieval-augmented generation is frequently marketed as "agent memory." Vectors excel at similarity search:

```text
"What's the status of the landing page job?"
        ↓
Retrieve project notes and past reports
        ↓
Ground the answer in retrieved chunks
```

Vectors alone do not provide:

- A canonical deadline on a project record
- A graph of dependencies among decisions and files
- A timestamped log of which deploy step failed

A practical stack combines:

| Store | Purpose |
|-------|---------|
| Vector DB | Semantic search over unstructured content |
| Relational DB | Users, projects, tasks, structured facts |
| Graph DB | Relationships among people, files, agents, goals |
| Object storage | Raw files, transcripts, exports |
| Event log | Full history of actions and state changes |

**Design rule:** behavior in the model; knowledge in retrieval; **truth in tools** (APIs, databases, version control).

---

## 6. Reducing context sensitivity

Instead of reacting only to the latest sentence, the agent follows a stable retrieval pipeline:

```text
User message
     ↓
Identify task / intent
     ↓
Retrieve relevant memory (structured + vector + recent events)
     ↓
Check active project state
     ↓
Build task-sized working context
     ↓
Respond or act
```

The agent operates from **persistent operating context**—the same project state whether the user asks "any updates?" or "what's blocking the deploy?"

---

## 7. Cumulative context and selective retention

Every interaction may update memory; not every token should persist. A typical write path:

```text
Conversation or job run
     ↓
Extract durable facts
     ↓
Update project / user state
     ↓
Store or re-embed changed documents
     ↓
Log actions and outcomes (transition memory)
     ↓
Refresh summaries only where appropriate
```

Summaries answer "what happened this week." They are poor for "which step caused the failure." Transition memory and summary serve different contracts.

---

## 8. Pulling context at runtime

On each request, the agent **pulls** context dynamically:

```text
User request → classify intent → resolve project scope
     → retrieve memories, files, recent actions, open tasks
     → assemble working context → respond or execute workflow
```

Retrieve **only what the task needs**. Task-sized context is cheaper, more accurate, and easier to audit than stuffing full history into the prompt.

---

## 9. Application: Hire My Agents

**Hire My Agents** is a workforce platform: users hire agents for **jobs**—personal assistant, engineer, PR—not chat sessions. Browse a roster, scope work, hand off, receive reports, approve public actions.

This requires:

- **Custom per user** — goals, tools, approvals, Personal Brain
- **Shared discipline** — role playbooks, eval gates, logging standards
- **Truth in tools** — external systems verify claims; the model does not assert deploy success without a log

Chatbots give advice. Workers need context they can audit.

---

## 10. Summary

The agent's context is not just a prompt. It is a persistent **data layer**—event logs, structured memory, vector search, project state, and causal transition history. The model pulls the right slice at runtime.

**Takeaways:**

1. Context window = working memory; durable state lives outside the model.
2. Layer stores by function—events, facts, vectors, live state, transitions.
3. Retrieve task-sized context; avoid amnesia via summary and noise via prompt stuffing.

This architecture connects product practice (Hire My Agents) to research on transition-centric memory (ASRA): **measure before you scale; grade logs, not stories.**

---

*Related: [Transition-Centric Memory and Directed Exploration](https://sci-layer.vercel.app/articles/transition-centric-memory-and-directed-exploration-asra) · [ASRA Phase 1](https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1) · [Hire My Agents](https://ilakk-manoharan.vercel.app/hire-my-agents)*
