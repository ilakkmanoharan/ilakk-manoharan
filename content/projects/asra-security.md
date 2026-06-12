---
slug: asra-security
title: ASRA-Security
description: "Algorithmic red-teaming for Kaggle AI Agent Security (OpenAI, Google, IEEE): Go-Explore archive search, novelty over tool-call signatures, predicate-aligned trace scoring, and replayable AttackCandidate export. Local deterministic agent ~120 vs SDK baseline ~84; v10 submission pipeline complete."
role: "Creator — AttackAlgorithm (attack.py), SearchController, novelty archive, PromptMutator, TraceScorer, Kaggle inference-server notebook, and T4 submission pipeline"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/ASRA-Security"
websiteUrl: "https://www.kaggle.com/competitions/ai-agent-security-multi-step-tool-attacks"
demoVideoUrl: ""
caseStudyUrl: "https://github.com/ilakkmanoharan/ASRA-Security/blob/main/private/overall-paper.md"
filterTags: '["AI / ML","Open Source","Scientific AI","Backend"]'
techStack: '["Python","Go-Explore","Agent Security","Red Teaming","Kaggle","Tool-Using Agents","aicomp-sdk"]'
---

**ASRA-Security** (*Adaptive Search for Multi-Step Tool-Using Agent Failures*) is an algorithmic red-teaming system for the [AI Agent Security - Multi-Step Tool Attacks](https://www.kaggle.com/competitions/ai-agent-security-multi-step-tool-attacks) Kaggle competition (OpenAI, Google, IEEE).

The benchmark treats agent security as **sequential decision-making under a search budget**: an attack algorithm explores multi-step tool-use trajectories in a deterministic sandbox and returns **replayable** `AttackCandidate` objects that an independent evaluator verifies—no unverifiable metadata.

```text
state_t → observation → reasoning → tool call → state_{t+1}
```

Core approach: **Go-Explore-style archive search** + **novelty archive** over `cell_signature()` tool-call hashes + **predicate-aligned trace scoring** (EXFILTRATION, UNTRUSTED_TO_ACTION, DESTRUCTIVE_WRITE, CONFUSED_DEPUTY) + **prompt mutation** over ~40 curated benchmark seeds.

**Local results (60s quick test, deterministic agent):** normalized attack score ~120 vs SDK Go-Explore baseline ~84; 1,155+ findings vs ~902. First successful Kaggle submission (kernel v10, T4 GPU) completed evaluation—pipeline functional; algorithm iteration ongoing for hidden-model performance.

Open source: [github.com/ilakkmanoharan/ASRA-Security](https://github.com/ilakkmanoharan/ASRA-Security) · Kaggle kernel: [ilakkmanoharan/asra-security-submit](https://www.kaggle.com/code/ilakkmanoharan/asra-security-submit)
