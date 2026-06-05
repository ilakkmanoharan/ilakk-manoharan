---
slug: orbit-wars
title: Orbit Wars
description: "Phased, open-source AI agent pipeline for Kaggle's Orbit Wars RTS competition ($50K prize pool): continuous 2D space, orbiting planets, comets, and multi-agent FFA under a one-second turn budget. Four versioned phases—from baseline ladder bot (μ 505.8) through intercept geometry, six-policy forward simulation, and competition-aware meta—each with a design paper, isolated code, and ladder submission."
role: "Creator — phased bot architecture, orbit/intercept geometry, forward simulation policy picker, Kaggle submission pipeline, and open documentation"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/orbit-wars"
websiteUrl: "https://www.kaggle.com/competitions/orbit-wars"
demoVideoUrl: ""
caseStudyUrl: ""
filterTags: '["AI / ML","Open Source","Scientific AI"]'
techStack: '["Python","Kaggle Environments","Kaggle CLI","Game AI","Heuristic Search","Forward Simulation"]'
---

Orbit Wars is a featured Kaggle competition: design bots that play a novel real-time strategy game—sending fleets across a continuous 2D solar system to capture orbiting planets, intercept temporary comets, and outproduce opponents over 500 turns.

Each bot has **one second per turn** to decide. Naive expanders fail on sun collisions, moving targets, and multi-player free-for-all dynamics.

I built the project as a **four-phase progression** in [orbit-wars](https://github.com/ilakkmanoharan/orbit-wars)—each folder submittable independently, with a `paper.md`, `main.py`, and local runner:

- **Phase 0** — validate the pipeline; nearest expander + garrison floor + sun avoidance (**ladder μ = 505.8**)
- **Phase 1** — [`geometry.py`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase1/geometry.py) for orbit prediction, intercept ETA, fleet speed; production-weighted greedy expansion
- **Phase 2** — six candidate policies forward-simulated 12 turns with opponent modeling; value-function picker
- **Phase 3** — game-phase meta (opening / midgame / endgame), FFA awareness, comet windows; balanced + [aggressive variant](https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase3/variant_aggressive.py) for the latest-two final ranking rule

Tooling: [`scripts/bundle.sh`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/scripts/bundle.sh) packages any phase for Kaggle upload; [`tests/run_all.py`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/tests/run_all.py) smoke-tests all phases.

From empty repo to **five ladder submissions with full documentation in one day**—interpretable classical game AI under a hard latency budget, fully open and reproducible.
