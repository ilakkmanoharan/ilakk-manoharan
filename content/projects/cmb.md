---
slug: cmb
title: CMB — Causal Memory Benchmark
description: "Foundational benchmark: which memory representation preserves causal understanding—not just factual recall—after long agent sessions? Same trajectory, four memory formats (full history, compressed summary, transition log, perturbation history), structured causal probes, decoy explanations, and held-out intervention types for generalization."
role: "Creator — research design, probe battery (attribution, failure analysis, intervention ID, counterfactuals), welfare significance framing, and integration with ASRA transition logging"
status: Research
featured: true
githubUrl: "https://github.com/ilakkmanoharan/asra"
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
relatedLinks: '[{"label":"Context as a data layer","url":"https://sci-layer.vercel.app/articles/agent-context-as-a-data-layer"},{"label":"Transition-centric memory","url":"https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1"},{"label":"ASDB (eval discipline)","url":"https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb"},{"label":"Hire My Agents","url":"/hire-my-agents"}]'
filterTags: '["AI / ML","Scientific AI"]'
techStack: '["Benchmark design","Causal memory","Transition logs","Intervention probes","Decoy explanations","Held-out generalization","Agent welfare"]'
---

**CMB** (*Causal Memory Benchmark*) asks a harder question than retrieval: when an LLM must explain **why** behavior, constraints, or reported internal states changed over a long session, which memory format keeps cause-and-effect intact?

The interaction trajectory is fixed; only the **memory format** changes before structured questioning — attribution, failure chains, multi-intervention identification, and counterfactuals. Scoring is against the **trajectory log**, not the model's self-summary.

Pairs with WMIB as foundational memory science → applied prerelease monitoring. Motivates transition-centric memory in Hire My Agents and the ASRA eval stack.
