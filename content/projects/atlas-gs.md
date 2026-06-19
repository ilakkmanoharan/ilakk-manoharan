---
slug: atlas-gs
title: Nature Foundation Models — Atlas-GS
description: "First runnable layer of the NFM stack: RGB-D ingest → persistent 3D Gaussian world models, mapping, localization (0.0102 m RMSE on TUM fr1_xyz), scene memory, and transition logging—CPU-first, simulation-first, Phases 0–6 complete. Part of the broader NFM program (NFM-Worlds, NFM-Robotics, ASRA, Decision Biology)."
role: "Creator — NFM hierarchy design, Atlas-GS Python package and CLI, Gaussian proxy field, TUM RGB-D evaluation, SciLayer implementation paper, and integration with the nine-phase ASRA stack"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/Nature-Foundation-Models"
websiteUrl: "https://nature-foundation-models.vercel.app"
demoVideoUrl: ""
caseStudyUrl: "https://sci-layer.vercel.app/articles/atlas-gs-end-to-end-implementation"
filterTags: '["AI / ML","Scientific AI","Open Source","Backend"]'
techStack: '["Python","3D Gaussian Splatting","RGB-D","ICP Localization","TUM RGB-D","Scene Memory","Transition Logging","FastAPI"]'
---

**Atlas-GS** is the first end-to-end implementation in the **Nature Foundation Models** hierarchy: NFM → NFM-Worlds → NFM-Robotics → Atlas → Atlas-GS.

It ingests RGB-D observations, builds persistent Gaussian world models, localizes subsequent frames against the map, persists world bundles across sessions, and logs `(state, action, state)` transitions for downstream learning—validated on TUM RGB-D `fr1_xyz` (4,018 gaussians, **0.0102 m** localization RMSE) without requiring GPU hardware or robot deployment for v1.

Program site: [nature-foundation-models.vercel.app](https://nature-foundation-models.vercel.app) (vision, hierarchy, Atlas-GS metrics, pitch decks, posters). Portfolio summary: [/nfm](/nfm). Implementation paper: [Atlas-GS on SciLayer](https://sci-layer.vercel.app/articles/atlas-gs-end-to-end-implementation). ASRA code: [github.com/ilakkmanoharan/asra](https://github.com/ilakkmanoharan/asra).
