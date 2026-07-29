---
slug: stratustalk
title: StratusTalk Inc
description: "Contract ML engineering — synthetic multi-turn dialogue datasets and LoRA fine-tuning for production voice AI receptionists: policy-constrained generation over finite-state call graphs, ChatML packaging, holdout evaluation, and generate→train→eval loops."
role: "Machine Learning Engineer (Contract) — Python CLI synthetic-data engine, controller vs verbalization decoupling, quota/stratified SM sampling, validation gates, Unsloth LoRA on GPU cluster, vLLM base-vs-adapter eval"
status: Active
featured: true
githubUrl: "https://github.com/antillestech/voxtune"
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
relatedLinks: '[{"label":"StratusTalk dataset generation architecture (v1)","url":"/voxlayer/index.html"},{"label":"StratusTalk dataset generation architecture (v2 — shipped)","url":"/voxlayer-v2/index.html"}]'
filterTags: '["AI / ML","Backend","Cloud"]'
techStack: '["Python","YAML","JSONL","ChatML","Unsloth","LoRA","PEFT","vLLM","Qwen","Gemma","Kubernetes","Helm","Laravel","Filament"]'
---

**StratusTalk Inc** builds conversational phone agents that follow a structured call policy (intent, messaging, transfer, confirm, close)—not free-form chat. As a contract ML engineer, I own the synthetic data and adaptation stack: end-to-end trajectory generation over finite-state dialogue graphs, Unsloth-compatible ChatML packaging, parameter-efficient fine-tuning of mid-size LLMs, and golden-set evaluation so model gains reflect generalization rather than train contamination.

**Architecture pages:**
- [/voxlayer/index.html](/voxlayer/index.html) — **v1** baseline (six-layer engine: config, SM edge planner, traversal, dialogue, assembler, JSONL writer)
- [/voxlayer-v2/index.html](/voxlayer-v2/index.html) — **v2 shipped**: SM edge planner, full-prefix traversal, entity pool, LLM dialogue, coverage report
