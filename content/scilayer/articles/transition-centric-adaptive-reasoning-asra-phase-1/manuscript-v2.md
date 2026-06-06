# Transition-Centric Adaptive Reasoning: ASRA Phase 1 for Interactive Environments (v2)

**Author:** Ilakkuvaselvi (Ilak) Manoharan  
**Affiliation:** Nature Foundation Models  
**Date:** June 2026  
**Version:** 2.0 — extends v1 with execution-fidelity theory and competition-orchestration concepts from the Phase 1 reference implementation (ARC Prize 2026, v11.4)

---

## Abstract

Interactive intelligence requires systems that discover what actions *mean* in unfamiliar environments rather than execute predefined policies. We describe **ASRA Phase 1** — a minimal agent architecture for fluid reasoning in sequential grid worlds where action labels are latent symbols and environment rules are hidden. The agent maintains transition evidence, infers state-conditioned action semantics from observed cell diffs, and explores under uncertainty while avoiding dead-end interventions.

Version 2 of this article adds **theoretical structure around execution fidelity**: how a reasoning agent must be isolated from a host scientific runtime, how validation and deployment phases differ, and how multi-game orchestration turns local transition learning into competition-scale evaluation. Phase 1 remains a research baseline: it prioritizes auditable reasoning loops over leaderboard optimization. Cognitive design, algorithms, and limitations are specified here without step-by-step platform instructions.

---

## 1. Why transitions come first

Most engineered agents receive actions with fixed semantics. `MOVE_LEFT` means move left because a programmer defined the mapping. In adaptive scientific settings — unfamiliar games, novel instruments, biological perturbations — the system often receives **tokens without definitions**. Meaning must be inferred from consequences:

```text
observe state_t  →  apply action a  →  observe state_{t+1}
```

ASRA Phase 1 treats this loop as the **primary unit of intelligence**. Memory is not an action transcript; it is a growing body of **transition evidence** linking states, interventions, and measurable diffs. Reasoning is hypothesis formation over latent operators:

```text
φ̂(a | s)  ≈  distribution of Δ(grid) and reward proxy  given (s, a)
```

This is an empirical operator, not a symbolic rule. The inferencer approximates *what tends to happen* when action *a* is applied in state *s*, without claiming access to the environment’s true transition function *T(s′ | s, a)*.

This framing aligns with ARC-style interactive benchmarks, where agents explore grid worlds up to 64×64, select among several action types (simple and coordinate-specified), and must infer mechanics under sparse feedback. It parallels **Decision Biology**, where perturbations are interventions and cellular readouts are state observations.

---

## 2. The Phase 1 reasoning loop

ASRA Phase 1 implements a closed loop with four stages:

```text
observe  →  log transition  →  infer semantics  →  explore under uncertainty  →  retry
```

| Stage | Role |
|-------|------|
| **Observe** | Receive grid frame and available action set from environment |
| **Log transition** | Compare consecutive frames; record cell-level diff and reward proxy |
| **Infer semantics** | Update beliefs about action effects conditioned on state identity |
| **Explore** | Select next action balancing novelty, uncertainty, and weak reward signal |

The loop is deliberately simple. Phase 1 does not assume object segmentation, symbolic rules, or language models. It asks whether a transition-centric agent can make *directed* exploration progress when action meaning is unknown.

### 2.1 Game-state lifecycle (interactive semantics)

Within each episode, the environment exposes a **finite-state control interface** that the agent must respect:

| State | Agent obligation |
|-------|------------------|
| `NOT_PLAYED` | Issue `RESET` to begin |
| `GAME_OVER` | Issue `RESET` before further play |
| Active play | Choose among **available** simple actions |
| `WIN` | Terminate episode (`is_done`) |

Phase 1 exploration applies only during active play. Treating RESET as a control primitive (not an exploratory action) reflects the competition API contract: the agent must align with environment lifecycle rather than treat all action enums symmetrically.

---

## 3. State representation

### 3.1 Canonical grids

Observations are integer grids. ASRA normalizes them to canonical 2D integer lists for stable comparison:

```python
def canonical_grid(grid):
    return np.array(grid, dtype=int).tolist()
```

### 3.2 State hashing

Full grids are not stored in inference tables. Each state receives a stable identifier via SHA-256 over JSON-serialized canonical grid content. Semantics are keyed by `(state_hash, action)` — the same action may behave differently in different contexts, so **conditioning on state identity is essential**.

This is a compression choice, not a claim that hash collisions are impossible. Phase 1 accepts hash identity as sufficient for exploratory policy; Phase 2 may add structural representations (objects, components, topology).

**Theoretical note:** hashing induces an equivalence relation over observations: *s₁ ~ s₂ iff hash(s₁) = hash(s₂)*. The agent reasons over equivalence classes, analogous to **partial observability buckets** in POMDP literature — with the caveat that distinct states may be merged.

---

## 4. Action semantics inference

**ActionSemanticsInferencer** maintains an empirical model of action effects per `(state_hash, action)` pair.

For each observed transition it records:

- **num_changed_cells** — count of grid cells differing between consecutive frames  
- **reward** — progress proxy (e.g., `levels_completed` metadata when available)

Given accumulated evidence, inference produces:

| Signal | Interpretation |
|--------|----------------|
| mean diff = 0 | likely no-op or blocked action |
| mean diff ≤ 1.5 | localized cell update |
| higher mean | multi-cell transform |
| consistency_score = 1/(1+std) | reproducibility of effect magnitude |

Hypothesis labels (`"no-op / blocked"`, `"localized cell update"`, etc.) are **human-readable summaries** of effect distributions, not ground-truth game rules.

The inferencer answers: *given what I have seen at this state, how predictable is each action's effect?*

### 4.1 Uncertainty as epistemic variance

Define **consistency** *c(s,a)* ∈ [0,1] from the standard deviation of observed cell-change counts. **Epistemic uncertainty** for exploration is:

```text
u(s,a) = 1                    if no observations for (s,a)
u(s,a) = 1 - min(1, c(s,a))   otherwise
```

High *u* means the agent has not yet stabilized a model of φ̂(a|s). This is distinct from **aleatoric** environment stochasticity; Phase 1 does not separate the two — both inflate variance in the effect table.

---

## 5. Uncertainty-aware exploration

**ASRAExplorer** selects the next action using a scoring function over candidates:

```text
score(a) = 2.0 / (1 + n(s,a))           # novelty — prefer less-tried actions
         + 0.7 * u(s,a)                  # prefer unknown or inconsistent semantics
         + 0.5 * mean_reward(a)         # weak exploitation signal
         + ε,  ε ~ Uniform(0, 0.05)     # tie-breaking jitter
```

where *n(s,a)* is the visit count for action *a* in state *s*.

**Dead-end detection:** if `(s,a)` produced zero cell changes and non-positive reward, the pair is excluded from future consideration at *s*. This implements a **per-state tabu** on empirically futile interventions — a cheap form of constraint learning without explicit environment models.

**Action space in Phase 1:** simple actions (`ACTION1`–`ACTION5`, `ACTION7`) are explored. Coordinate-specified complex actions (`ACTION6`) are deferred; when required, Phase 1 uses a **center-grid default** — a placeholder spatial policy, not a learned pointer model.

The explorer implements **information-directed probing**: prefer interventions that reduce uncertainty about latent semantics rather than random walk.

### 5.1 Relation to active learning

The scoring function is a heuristic **acquisition rule** over discrete actions:

- novelty term ≈ favor under-sampled (s,a)  
- uncertainty term ≈ favor high epistemic error  
- reward term ≈ weak exploitation of progress proxy  

Phase 1 does not compute information gain in bits; it trades off three scalar signals. Phase 3 may replace this with explicit expected information gain over a state graph.

---

## 6. Agent integration and multi-game orchestration

**ASRAAgent** extends a standard interactive agent interface:

| Method | Behavior |
|--------|----------|
| `is_done` | Stop on `WIN` or action budget exhausted (`MAX_ACTIONS = 80` default) |
| `choose_action` | `RESET` when not playing; else delegate to ASRAExplorer |
| `take_action` | Record action name for transition attribution |
| `append_frame` | Compute diff; update semantics inferencer and explorer |

Each action carries reasoning metadata for traceability (e.g., `"ASRA v0.3: ACTION3"`).

### 6.1 Swarm orchestration (competition-scale evaluation)

For benchmarks with many private games, Phase 1 uses **Swarm** orchestration:

```text
Arcade.get_environments()  →  [game_id₁, …, game_idₙ]
        ↓
For each game_id: spawn ASRAAgent instance (parallel threads)
        ↓
Open scorecard → run agents → close scorecard → aggregate EnvironmentScorecard
```

**Theoretical interpretation:** each game is an independent **intervention environment** with shared policy modules (`GLOBAL_SEMANTICS`, `GLOBAL_EXPLORER`) in Phase 1. That sharing is a deliberate simplification — it treats semantics as **domain-general action-effect statistics**, which may help transfer but causes cross-game contamination. Phase 2 isolates memory per `game_id`.

The scorecard aggregates per-environment runs into rows: `game_id`, `score`, `levels_completed`, `actions`, `completed`. Best run per environment is selected by lexicographic preference on score and levels completed.

---

## 7. Two-phase evaluation model (validation vs. scoring)

A subtle but important concept in code-competition evaluation — reflected in the Phase 1 reference pipeline — is the **separation of validation from scoring**:

| Phase | What runs | What it proves |
|-------|-----------|----------------|
| **Validation (Run All)** | Bootstrap runtime → write agent artifact → smoke test → write gate file | Artifacts exist; imports succeed; environment wired |
| **Scoring (re-run)** | Platform executes agent as `__main__` → `run_swarm()` → API play | Agent survives isolated process; takes actions; produces scorecard |

**Conceptual point:** a successful validation run does **not** imply successful scoring. Validation tests **existence and importability** of the reasoning stack; scoring tests **end-to-end intervention** on private games through the competition API.

The gate artifact (`submission.parquet`) is often a **structural prerequisite** only — a file that enables the submit button. The substantive score comes from API interactions during the scoring re-run, when the agent must open a scorecard, play all assigned games, and close the scorecard.

Phase 1 research should report both: (1) validation pass rate and bootstrap latency, (2) scoring outcome and scorecard aggregates — not conflate them.

---

## 8. Execution fidelity and runtime isolation

The v11.4 reference implementation introduces a design principle absent from v1 of this article: **the reasoning runtime must be reproducibly isolated from the host environment**.

### 8.1 Problem: host stack pollution

Competition bundles ship pinned wheels (`arc_agi`, `arcengine`, numpy, etc.). Installing them into a shared host Python (e.g., a notebook kernel already loaded with TensorFlow, Gradio, Colab pins) creates **dependency interference**: upgraded numpy/pandas may satisfy the agent but break unrelated packages, and pip resolver warnings signal **non-identifiable runtime state**.

For scientific agents, non-identifiable runtime state violates reproducibility — two “identical” submissions may behave differently depending on import order and site-packages mutations.

### 8.2 Solution: dedicated competition venv

Phase 1 reference architecture uses a **dedicated virtual environment** (`asra_venv`) with:

| Mechanism | Purpose |
|-----------|---------|
| `--system-site-packages` | Retain host utilities needed for artifacts (e.g., pandas/pyarrow for parquet) |
| `--without-pip` inside venv | Avoid `ensurepip` failures on restricted hosts |
| `pip install --target venv/site-packages --no-deps` | Install competition wheels **only** into venv, without upgrading host |
| `os.execve(venv_python, …)` on agent entry | Scoring subprocess uses **same interpreter** as validation smoke test |

**Theoretical framing:** this is **epistemic isolation** of the intervention loop. The agent’s transition semantics are computed inside a closed import graph; the host notebook kernel remains a **launcher**, not a participant in reasoning.

Environment flags:

- `ASRA_VENV_ACTIVE` — prevents re-exec loops  
- `PYTHONNOUSERSITE=1` — blocks user-site leakage into the venv process  
- `OPERATION_MODE=COMPETITION` — selects API-backed play (competition endpoint injected; no external API key in notebook)

### 8.3 Asset mirroring and path resolution

Scoring workers may not expose competition input paths identically to the notebook kernel. The reference pipeline **mirrors** `arc_agi_3_wheels`, `ARC-AGI-3-Agents`, and `environment_files` into a working-directory bundle and resolves `comp_root` from an ordered candidate list (competition mount, alternate slug, local mirror).

**Conceptual point:** bootstrap is **path-invariant** — the same agent code must self-configure from whichever mount is visible. This is infrastructure for **deployment robustness**, not part of the cognitive model, but it encodes the assumption that *reasoning code cannot rely on a single filesystem layout*.

### 8.4 Minimal dependency surface (stub agents package)

The official agents repository imports optional templates (LangGraph, LLM agents, etc.). Phase 1 loads only `tracing`, `recorder`, `agent`, and `swarm` via a **stub package** that skips `agents/__init__.py`.

**Theoretical interpretation:** **cognitive modules should not drag epistemic dependencies they do not use**. Full template registries are useful for research forks but enlarge the failure surface at scoring time. Phase 1 treats Swarm+Agent as the minimal **orchestration kernel**; richer agents are Phase 2+ extensions.

### 8.5 Self-test as process isomorphism

Before submission, the reference pipeline runs:

```text
venv_python my_agent.py --self-test
```

This verifies that the **same interpreter** that will run scoring can import `arc_agi`, `arcengine`, register `ASRAAgent`, and reach `run_swarm` — without executing full multi-game play (which requires competition API during validation).

**Conceptual point:** self-test checks **process isomorphism**, not task performance. It is necessary but not sufficient for scoring success.

---

## 9. Hyperparameters and operational semantics

| Parameter / env | Default | Role |
|-----------------|---------|------|
| `ASRA_SEED` | 42 | Reproducibility for exploration jitter |
| `ASRA_MAX_ACTIONS` | 80 | Per-episode budget |
| `SIMPLE_ACTIONS` | ACTION1–5, ACTION7 | Explored action subset |
| `RECORDINGS_DIR` | working/recordings | Trace storage for agent runs |
| `ENVIRONMENTS_DIR` | environment_files | Local game definitions when offline |
| `ARC_BASE_URL` | https://three.arcprize.org | API root (overridable) |

Seeds apply to Python `random` and NumPy at module load.

---

## 10. Limitations

Phase 1 is a baseline, not a solver.

**Algorithmic gaps:**

1. Cell-level diffs only — no object-centric parsing or component tracking  
2. Statistical semantics — no explicit structural or causal world model  
3. No planning — no search over inferred state graphs for goal-directed paths  
4. ACTION6 excluded — coordinate actions not learned  
5. Global shared memory — semantics not isolated per game  
6. Weak reward signal — `levels_completed` proxy may not align with fine-grained game structure  

**Execution gaps:**

7. Validation ≠ scoring — import success does not guarantee API play success  
8. Venv/bootstrap complexity — operational failure modes (ensurepip, site-package shadowing) are orthogonal to reasoning but can mask agent quality  
9. Parallel Swarm threads — race conditions on global semantics tables under extreme timing (Phase 2: per-game locks or isolated stores)  

**What Phase 1 establishes:**

- A reproducible transition-first memory discipline  
- State-conditioned latent action semantics with explicit uncertainty  
- Information-biased exploration with dead-end tabu  
- A theory of **runtime isolation** for deployable scientific agents  
- A bridge from cognitive architecture research to competition-scale interactive evaluation  

---

## 11. Phase 2 directions

| Direction | Goal |
|-----------|------|
| Object-centric diffs | Connected components, bounding boxes, transform classes |
| State graph planner | Shortest-path or MCTS over inferred transitions |
| Per-game memory | Isolated semantics keyed by environment identity |
| ACTION6 policy | Learned or heuristic coordinate selection |
| Symbolic abstraction | Compress transition patterns into reusable concepts |
| Formal active learning | Replace heuristic score with information gain |
| Decision Biology transfer | Perturbations as actions, cellular states as observations |

---

## 12. Position in the ASRA program

ASRA Phase 1 on interactive grid worlds is the **exploration front-end** of a larger architecture:

- **Nature Foundation Models** — multi-domain scientific intelligence  
- **Decision Biology** — perturbation–response reasoning under uncertainty  
- **Conceptual review** — world models, causality, active inference as unified frame  

The same abstraction — *latent action semantics inferred from transitions* — applies whether the environment is a puzzle game or a perturbed cell culture. Version 2 adds: *the runtime that executes those transitions must be isolated, path-invariant, and verified under the same process model as deployment*.

---

## 13. Conclusion

ASRA Phase 1 demonstrates that interactive intelligence can be framed as **scientific reasoning from transitions**: observe, intervene, measure change, revise beliefs, probe uncertainty. Version 2 makes explicit that this loop also demands **execution fidelity** — a reproducible, isolated runtime; a clear distinction between validation and scoring; and orchestration machinery that scales single-episode reasoning to many games without confusing structural gates with substantive performance.

The architecture remains modest so each component can be audited and extended. The real test is generalization in environments never seen during development. Phase 1 provides the reasoning scaffold and the execution theory; subsequent phases add structure, planning, and domain-specific perception.

---

## Reference notebooks (GitHub)

Reference implementations for this paper are maintained in the [ASRA `kaggle-notebooks` folder](https://github.com/ilakkmanoharan/SciLayer/tree/main/content/kaggle-notebooks):

- [ASRA Phase 1 — ARC Prize 2026 (v11.4 reference notebook)](https://github.com/ilakkmanoharan/SciLayer/blob/main/content/kaggle-notebooks/asra-phase-1-arc-prize-2026-v4-fixed.ipynb)
- [ASRA v0.3 — Kaggle submission notebook](https://github.com/ilakkmanoharan/SciLayer/blob/main/content/kaggle-notebooks/asra_v0_3_kaggle_submission.ipynb)
- [ASRA v0.2 — Phase 1 ARC-AGI-3 (Kaggle-ready)](https://github.com/ilakkmanoharan/SciLayer/blob/main/content/kaggle-notebooks/asra_v0_2_phase1_arc_agi3_notebook.ipynb)
- [ASRA v0.1 — Phase 1 ARC-AGI-3 (introductory)](https://github.com/ilakkmanoharan/SciLayer/blob/main/content/kaggle-notebooks/asra_v0_1_phase1_arc_agi3_notebook.ipynb)

---

## References

1. Chollet, F. On the Measure of Intelligence. *arXiv* (2019).  
2. ARC Prize Foundation. ARC-AGI-3 documentation. https://docs.arcprize.org  
3. Ilakkuvaselvi Manoharan ASRA: Adaptive Scientific Reasoning Architecture. https://github.com/ilakkmanoharan/asra  
4. Ilakkuvaselvi Manoharan Understanding Action Semantics Inference Through State Transitions in ASRA. https://sci-layer.vercel.app/articles/understanding-action-semantics-inference-through-state-transitions-in-asra  
5. Ilakkuvaselvi Manoharan Architectures for Adaptive Scientific Reasoning Under Uncertainty. https://sci-layer.vercel.app/articles/architectures-adaptive-scientific-reasoning-under-uncertainty  
6. Ilakkuvaselvi Manoharan Transition-Centric Adaptive Reasoning: ASRA Phase 1 (Version 1). https://sci-layer.vercel.app/articles/transition-centric-adaptive-reasoning-asra-phase-1 (version history)  
7. ARC Prize Foundation / Kaggle. ARC Prize 2026 — ARC-AGI-3 code competition discussion on submission mechanics (validation gate vs. API scoring).

---

*Correspondence: ilakkmanoharan@gmail.com*
