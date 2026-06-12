---
slug: arc-neurogolf
title: ARC-Genome (ARC-NeuroGolf)
description: "Neural circuit compiler for NeuroGolf 2026 (IJCAI-ECAI / Kaggle, $50K): infer ARC-AGI transformations and compile minimal ONNX graphs per task—11+ analytical solvers, conv fallbacks, composition search, and ARC-GEN validation. Six phases + Milestone 1b: 52 pass_all tasks, Kaggle 388.20 verified, ~843 estimated after ARC-GEN gating."
role: "Creator — ARC-Genome compiler (arc_genome/), six cumulative phase flags, official ORT-profiler scoring, ARC-GEN validation gate, tier audit tooling, and competition submission pipeline"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/ARC-NeuroGolf"
websiteUrl: "https://www.kaggle.com/competitions/neurogolf-2026"
demoVideoUrl: ""
caseStudyUrl: "https://github.com/ilakkmanoharan/ARC-NeuroGolf/blob/main/private/paper.md"
filterTags: '["AI / ML","Open Source","Scientific AI"]'
techStack: '["Python","ONNX","ARC-AGI","Program Synthesis","Neural Circuits","Kaggle","ARC-GEN","Minimum Description Length"]'
---

**ARC-Genome** is a neural circuit compiler for the [NeuroGolf 2026](https://www.kaggle.com/competitions/neurogolf-2026) Kaggle competition (IJCAI-ECAI 2026, $50K prize pool). The competition asks not merely *can you solve the ARC task?* but *what is the cheapest neural network that implements the transformation?*

Each ARC-AGI puzzle becomes a program to infer and compile into a **minimal static ONNX graph**—not a dataset to train on:

```text
ARC examples → infer transformation φ → compile φ to minimal ONNX → validate
score(task) = max(1, 25 − ln(cost))   where cost = num_parameters + memory_bytes
```

The pipeline includes 11+ Tier-0 analytical solvers (color_map, transpose, rotate, tile, …), extended ops, family templates, depth-3 composition search, and conv least-squares fallbacks—with **ARC-GEN-100K** synthetic validation so only generalizing circuits earn Kaggle points.

**Key finding:** raw solve count is misleading. Phase 6 solved 199/400 tasks locally but only **23 pass_all** earned points (388.20 on the leaderboard). Milestone 1b re-solving with ARC-GEN gating at acceptance time raised verified tasks to **52** with an estimated score of **~843**—quality beats quantity.

Open source: [github.com/ilakkmanoharan/ARC-NeuroGolf](https://github.com/ilakkmanoharan/ARC-NeuroGolf) — `arc_genome/`, phased papers in `phases/`, `scripts/run_phase.py`, official scorer port, and audit tooling.
