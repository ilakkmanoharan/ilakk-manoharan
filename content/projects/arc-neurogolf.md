---
slug: arc-neurogolf
title: ARC-Genome (ARC-NeuroGolf)
description: "Neural circuit compiler + autonomous Kaggle agent for NeuroGolf 2026 (IJCAI-ECAI / Kaggle, $50K): ARC-Genome ONNX solvers, Agent 1 continuous submission loop, and score-targeted LoRA adapters (Diagnose / Strategize / Implement). Best Kaggle 915.03, 70 pass_all verified tasks."
role: "Creator — ARC-Genome compiler (arc_genome/), Agent 1 cloud loop (Cursor API + GitHub Actions), MLX LoRA adapters, ARC-GEN validation gate, and competition submission pipeline"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/ARC-NeuroGolf"
websiteUrl: "/projects/arc-neurogolf"
demoVideoUrl: ""
caseStudyUrl: "https://github.com/ilakkmanoharan/ARC-NeuroGolf/blob/main/private/paper.md"
relatedLinks: '[{"label":"LoRA research","url":"/projects/arc-neurogolf"},{"label":"GitHub","url":"https://github.com/ilakkmanoharan/ARC-NeuroGolf"},{"label":"Kaggle competition","url":"https://www.kaggle.com/competitions/neurogolf-2026"},{"label":"Submission research","url":"https://github.com/ilakkmanoharan/ARC-NeuroGolf/tree/main/kaggle-submissions/research"}]'
filterTags: '["AI / ML","Open Source","Scientific AI"]'
techStack: '["Python","ONNX","ARC-AGI","LoRA","MLX","GitHub Actions","Kaggle","ARC-GEN","Program Synthesis"]'
---

**ARC-Genome** compiles ARC-AGI puzzles into **minimal static ONNX graphs** for [NeuroGolf 2026](https://www.kaggle.com/competitions/neurogolf-2026) — score = circuit cost, not raw solve count.

An **autonomous Agent 1 loop** (Cursor Cloud + GitHub Actions) runs continuously: solve → submit → poll Kaggle every 10 minutes → logs → **LoRA-guided** diagnose → plan → implement → repeat. Three MLX LoRA adapters on Llama-3.2-3B learn from synthetic rows mined from our own submission analyses — goal: **raise Kaggle public score**.

**Current best:** **915.03** Kaggle, **70** pass_all verified tasks (2026-06-17 submission-4). LoRA research charts and adapter stats: [/projects/arc-neurogolf](/projects/arc-neurogolf).

Open source: [github.com/ilakkmanoharan/ARC-NeuroGolf](https://github.com/ilakkmanoharan/ARC-NeuroGolf)
