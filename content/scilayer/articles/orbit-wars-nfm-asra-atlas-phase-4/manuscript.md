# Orbit Wars Phase 4: Applying NFM, ASRA, and Atlas-GS to Multi-Agent RTS Competition

**Author:** Ilakkuvaselvi Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** June 2026  
**Version:** 1.0 — SciLayer preprint (implementation paper)

## Abstract

We present **Orbit Wars Phase 4**, an open-source Kaggle competition agent that unifies three research frameworks—**Nature Foundation Models (NFM)**, **Adaptive Scientific Reasoning Architecture (ASRA)**, and **Atlas-GS**—within a real-time strategy environment. Orbit Wars is a continuous 2D multi-agent game where bots send fleets across an orbiting solar system to capture planets, intercept comets, and maximize ship count over 500 turns under a one-second-per-turn decision budget. Phase 4 maps NFM's state–action–dynamics abstraction to explicit world-state transitions, adapts Atlas-GS Gaussian spatial splatting as a 2D production-value field for target prioritization, and implements ASRA's Observe → Hypothesize → Experiment → Analyze → Act loop via five strategic hypotheses tested through 15-turn forward simulation. The agent builds on Phase 2's simulation core (best ladder score μ=600 in prior submissions) while replacing naive nearest-neighbor targeting with spatially-aware economic reasoning and hypothesis-driven policy selection. Code is open-sourced at [github.com/ilakkmanoharan/orbit-wars](https://github.com/ilakkmanoharan/orbit-wars).

**Keywords:** Orbit Wars, Nature Foundation Models, ASRA, Atlas-GS, world models, game AI, Kaggle, multi-agent RTS, Gaussian value fields, hypothesis-driven planning

---

## 1. Introduction

Competition agents for novel environments must balance **domain knowledge**, **lookahead planning**, and **strict latency budgets**. Orbit Wars—a featured Kaggle competition with a $50,000 prize pool—presents a continuous 2D board with orbiting planets, a lethal central sun, scaling fleet speeds, and temporary comet captures. Naive bots that aim at current planet positions or ignore production economics fail quickly.

Phase 4 applies the NFM research hierarchy in a new domain:

```text
Nature Foundation Models (NFM)        → State_t + Action_t → State_{t+1}
NFM-Worlds / Atlas-GS                 → Gaussian spatial value field
ASRA (Adaptive Scientific Reasoning)  → Observe → Hypothesize → Experiment → Act
```

This paper documents the concept mapping, architecture, and implementation. The agent is competition-ready and submitted to the Orbit Wars ladder as `phase4 nfm-asra-atlas v1`.

---

## 2. The Orbit Wars Environment

Key mechanics that shape agent design:

| Mechanic | Implication |
|---|---|
| Continuous 2D space (100×100) | Segment-based collision; intercept geometry required |
| Inner planets rotate around sun | Must predict future positions, not current |
| Sun at center (radius 10) | Straight-line paths through center destroy fleets |
| Fleet speed scales with size (log curve) | Size–speed tradeoff on every launch |
| Comets spawn at steps 50/150/250/350/450 | Temporary high-value capture windows |
| 500 turns; 1 second per turn | No heavy ML; classical AI + lightweight simulation |
| Win = highest ship count | Production compounds; economy matters |

---

## 3. NFM — World Model Layer

The NFM core abstraction:

```text
State_t + Action_t → State_{t+1}
```

**State** includes planet positions, owners, garrisons, production, active fleets, and turn step.  
**Action** is a list of fleet launches: `[from_planet_id, angle, num_ships]`.  
**Dynamics** encompass production ticks, orbit rotation, fleet movement, and combat resolution.

`world_model.py` implements `WorldState` as an explicit representation and uses `simulation.py` for forward transitions. Each candidate action sequence is evaluated by rolling the dynamics forward—mirroring NFM-Worlds' emphasis on learning how environments evolve through intervention.

---

## 4. Atlas-GS — Gaussian Spatial Value Field

Atlas-GS builds persistent 3D scene representations via Gaussian Splatting. For Orbit Wars we adapt this to a **2D Gaussian value splat** over the board:

Each planet contributes a kernel centered at `(x, y)` with weight:

- `production` for capturable neutrals
- `production × 0.5` for enemy planets
- `production × 2` for owned planets (defense value)

Target priority combines field value and travel time:

```text
score = gaussian_value(target) × 0.1 + production / (eta + 1)
```

This replaces nearest-neighbor expansion with spatially-aware economic reasoning—planets in high-value regions of the field are prioritized even when not strictly closest.

---

## 5. ASRA — Scientific Reasoning Loop

ASRA's recursive cycle:

```text
Observe → Hypothesize → Experiment → Analyze → Act
```

Each turn, Phase 4:

1. **Observes** the full game state via `WorldState`
2. **Hypothesizes** five strategic theories (policy clusters)
3. **Experiments** by forward-simulating each hypothesis 15 turns
4. **Analyzes** predicted production and ship totals
5. **Acts** on the opening moves of the best-supported hypothesis

| Hypothesis | Strategic theory | Policy cluster |
|---|---|---|
| H1: Economy | High-production neutrals win long games | `expand_neutrals` + `conservative` |
| H2: Aggression | Eliminate weakest enemy early | `snipe_weakest` + `expand_all` |
| H3: Comets | Temporary captures compound ship count | `comet_rush` |
| H4: Consolidation | Reinforce before expanding | `reinforce_home` |
| H5: Balanced | Mixed expansion robust in FFA | `expand_all` |

`asra_reasoner.py` implements the hypothesis–experiment loop; `agent.py` generates moves per policy using Atlas-GS target scoring.

---

## 6. Architecture and Prior Results

```
phase4/
  world_model.py     — NFM state + Atlas-GS value field
  asra_reasoner.py   — Hypothesis generation and experiment loop
  geometry.py        — Orbit prediction, intercept ETA, sun check
  simulation.py      — Forward rollout engine
  agent.py           — Integration layer
  main.py            — Kaggle entry point
```

Prior ladder submissions established a performance baseline:

| Phase | Approach | Skill rating μ |
|---|---|---|
| 0 | Baseline expander | 479.2 |
| 1 | Production heuristics + intercept | 477.6 |
| 2 | 6-policy sim picker (depth 12) | **600.0** |
| 3 | Game-phase meta-strategy | 385.2–398.0 |

Phase 4 retains Phase 2's simulation core (best performer) and layers NFM explicit dynamics, Atlas-GS spatial targeting, and ASRA hypothesis selection (depth 15, 5 theories).

---

## 7. Submission

```bash
./scripts/bundle.sh phase4
kaggle competitions submit orbit-wars -f submission.tar.gz -m "phase4 nfm-asra-atlas v1"
```

Repository: [github.com/ilakkmanoharan/orbit-wars](https://github.com/ilakkmanoharan/orbit-wars)  
Competition: [kaggle.com/competitions/orbit-wars](https://www.kaggle.com/competitions/orbit-wars)

---

## 8. Conclusion

Orbit Wars Phase 4 demonstrates that the NFM → Atlas-GS → ASRA stack is not limited to robotics or ARC-style puzzles—it transfers to competitive multi-agent RTS with strict latency constraints. Explicit world-state dynamics, Gaussian spatial value fields, and hypothesis-driven simulation provide interpretable, competition-grade decision-making without neural network inference. Future work includes transition-centric memory across episodes (ASRA Phase 1), opponent modeling from replay logs, and deeper mechanism discovery for orbital combat dynamics.
