---
slug: asdb
title: ASDB — Adaptive Scientific Discovery Benchmark
description: "Two-track eval framework for interactive agents: Track A grades recovery of unlabeled action semantics from state transitions; Track B grades hidden-mechanism inference and held-out prediction under an intervention budget. Linked A→B episodes separate tool-learning from theory-learning with decoy hypotheses and full audit logs."
role: "Creator — benchmark design, construct decomposition (semantics vs discovery), episode protocols, anti-gaming with decoy theories, and SciLayer concept paper"
status: Active
featured: true
githubUrl: "https://github.com/ilakkmanoharan/asra"
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: "https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb"
relatedLinks: '[{"label":"Action semantics (ASRA)","url":"https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra"},{"label":"Transition-centric reasoning","url":"https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1"},{"label":"Hire My Agents evals","url":"/hire-my-agents"}]'
filterTags: '["AI / ML","Scientific AI","Open Source"]'
techStack: '["Benchmark design","Interactive agents","Intervention budgets","Held-out prediction","Decoy falsification","Audit logs","ASRA"]'
---

**ASDB** (*Adaptive Scientific Discovery Benchmark*) evaluates whether agents can learn what interventions **do** from interaction, then use that knowledge to infer hidden mechanisms and predict held-out observables — without documented tool schemas or curve-fitting on surface patterns.

**Track A** scores action-semantics recovery \(\hat{\phi}(a)\) from unlabeled controls. **Track B** scores mechanism class and predictive accuracy under a fixed intervention budget. Combined **A→B** episodes quantify how much documented tools inflate discovery scores.

Part of the eval-before-scale line behind ASRA and Hire My Agents: define the construct, log ground truth, falsify with decoys, generalize on held-out conditions — then scale.
