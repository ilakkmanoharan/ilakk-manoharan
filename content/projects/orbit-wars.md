---
slug: orbit-wars
title: Orbit Wars
description: "Phased, open-source AI agent pipeline for Kaggle's Orbit Wars RTS competition ($50K prize pool): continuous 2D space, orbiting planets, comets, and multi-agent FFA under a one-second turn budget. Five versioned phases—from baseline ladder bot (μ 505.8) through intercept geometry, six-policy forward simulation, competition meta, and Phase 4 unifying NFM × ASRA × Atlas-GS."
role: "Creator — phased bot architecture, orbit/intercept geometry, forward simulation policy picker, NFM/ASRA/Atlas-GS integration (Phase 4), Kaggle submission pipeline, SciLayer implementation paper, and open documentation"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/orbit-wars"
websiteUrl: "https://www.kaggle.com/competitions/orbit-wars"
demoVideoUrl: ""
caseStudyUrl: "https://sci-layer.vercel.app/articles/orbit-wars-nfm-asra-atlas-phase-4"
filterTags: '["AI / ML","Open Source","Scientific AI"]'
techStack: '["Python","Kaggle Environments","Kaggle CLI","Game AI","Heuristic Search","Forward Simulation","NFM","ASRA","Atlas-GS"]'
---

Orbit Wars is a featured Kaggle competition: design bots that play a novel real-time strategy game—sending fleets across a continuous 2D solar system to capture orbiting planets, intercept temporary comets, and outproduce opponents over 500 turns.

Each bot has **one second per turn** to decide. Naive expanders fail on sun collisions, moving targets, and multi-player free-for-all dynamics.

I built the project as a **five-phase progression** in [orbit-wars](https://github.com/ilakkmanoharan/orbit-wars)—each folder submittable independently, with a `paper.md`, `main.py`, and local runner:

- **Phase 0** — validate the pipeline; nearest expander + garrison floor + sun avoidance (**ladder μ = 505.8**)
- **Phase 1** — [`geometry.py`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase1/geometry.py) for orbit prediction, intercept ETA, fleet speed; production-weighted greedy expansion
- **Phase 2** — six candidate policies forward-simulated 12 turns with opponent modeling; value-function picker (**best ladder μ = 600**)
- **Phase 3** — game-phase meta (opening / midgame / endgame), FFA awareness, comet windows; balanced + [aggressive variant](https://github.com/ilakkmanoharan/orbit-wars/blob/main/phase3/variant_aggressive.py)
- **Phase 4** — **NFM × ASRA × Atlas-GS**: explicit `State_t + Action_t → State_{t+1}` world model (`world_model.py`), 2D Gaussian spatial value splat for target priority (Atlas-GS), and ASRA's Observe → Hypothesize → Experiment → Analyze → Act loop with five strategic hypotheses forward-simulated 15 turns per decision. [SciLayer implementation paper](https://sci-layer.vercel.app/articles/orbit-wars-nfm-asra-atlas-phase-4).

Tooling: [`scripts/bundle.sh`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/scripts/bundle.sh) packages any phase for Kaggle upload; [`tests/run_all.py`](https://github.com/ilakkmanoharan/orbit-wars/blob/main/tests/run_all.py) smoke-tests all phases.

From empty repo to **multiple ladder submissions with full documentation**—interpretable classical game AI under a hard latency budget, now bridging competition engineering with the Nature Foundation Models research stack.
