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
relatedLinks: '[{"label":"Voxlayer dataset generation architecture page","url":"/voxlayer/index.html"}]'
filterTags: '["AI / ML","Backend","Cloud"]'
techStack: '["Python","sipagent","YAML","JSONL","vLLM","Gemma","Kubernetes","Laravel","Filament","Unsloth","Helm"]'
---

**VoxLayer** is a contract engagement building training data for production phone receptionist AI (sipagent skillsets). The generator walks the real state machine, freezes company/caller context per scenario, and emits sipagent-faithful ChatML rows for fine-tuning.

**Architecture page:** [/voxlayer/index.html](/voxlayer/index.html) — interactive six-layer diagram with green (shipped Jul 6) vs purple (D-01 v2 plan) Q&amp;A.
