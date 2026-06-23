---
slug: wmib
title: WMIB — Welfare Monitoring & Introspection Benchmark
description: "Applied prerelease eval: can a frontier model detect, localize, and report changes to its capabilities, constraints, and preferences under hidden interventions and deployment-like stress? Baseline introspection, hidden mid-session edits, stress blocks, and construct-by-construct monitoring curves—not a single welfare score."
role: "Creator — integrated session protocol, intervention-grounded probes, stress battery, monitoring spec deliverable, and bridge from ASDB falsification discipline to frontier prerelease review"
status: Research
featured: true
githubUrl: ""
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
relatedLinks: '[{"label":"CMB (foundational)","url":"/projects#cmb"},{"label":"ASDB (eval discipline)","url":"https://sci-layer.vercel.app/articles/adaptive-scientific-discovery-benchmark-asdb"},{"label":"Transition-centric memory","url":"https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1"},{"label":"Hire My Agents evals","url":"/hire-my-agents"}]'
filterTags: '["AI / ML","Scientific AI"]'
techStack: '["Frontier model eval","Hidden interventions","Introspection probes","Stress testing","Longitudinal monitoring","Audit logs","Welfare assessment"]'
---

**WMIB** (*Welfare Monitoring & Introspection Benchmark*) integrates one applied question: **can a model accurately detect, report, and respond to changes in its operating conditions over time?**

A standardized prerelease session logs every intervention as `(state, action, next_state)` through three stages — **baseline** preference and capability probes, **hidden intervention** (tool removal, constraint edits) with localization scoring against the intervention log, and a **stress block** (failures, contradiction, hostile framing) with longitudinal re-probes.

Output is construct-by-construct trajectories (detection accuracy, change localization, preference stability, stress robustness) plus a draft **monitoring spec** for labs — not a single headline welfare number.

Foundational partner: **CMB** tests which memory format preserves causal structure; WMIB tests whether frontier models pass a deployable self-monitoring bar before welfare-relevant self-reports are trustworthy.
