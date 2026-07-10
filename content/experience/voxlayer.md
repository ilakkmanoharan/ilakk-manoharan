---
slug: voxlayer
title: VoxLayer
description: "ICA contract — dynamic dataset generation for sipagent phone agents: six-layer engine (config, SM edge planner, traversal, dialogue, assembler, JSONL writer), production-faithful messages[] with runtime context and next_state tags, CLI + validator + GPU cluster deployment."
role: "Software Engineer — D-01–D-05 deliverables: voxtune-generate CLI, YAML config, traversal/paraphrase decoupling, sipagent ChatML assembler, voxtune-validate, N=500 sample dataset, Filament studio + Helm on L40S"
status: Active
featured: true
githubUrl: "https://github.com/antillestech/voxtune"
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
relatedLinks: '[{"label":"Voxlayer dataset generation architecture (v1)","url":"/voxlayer/index.html"},{"label":"Voxlayer dataset generation architecture (v2 — shipped)","url":"/voxlayer-v2/index.html"}]'
filterTags: '["AI / ML","Backend","Cloud"]'
techStack: '["Python","sipagent","YAML","JSONL","vLLM","Qwen","Gemma","Kubernetes","Laravel","Filament","Unsloth","Helm"]'
---

**VoxLayer** is a contract engagement building training data for production phone receptionist AI (sipagent skillsets). The generator walks the real state machine, freezes company/caller context per scenario, and emits sipagent-faithful ChatML rows for fine-tuning.

**Architecture pages:**
- [/voxlayer/index.html](/voxlayer/index.html) — **v1** Jul 6 baseline (green = shipped then; purple = early v2 plan)
- [/voxlayer-v2/index.html](/voxlayer-v2/index.html) — **v2 shipped** (all green): SM edge planner, full-prefix traversal, entity pool, full LLM dialogue via Qwen, coverage report
