# ARC-Genome: Minimal Neural Circuits for ARC-AGI

**A project paper on the NeuroGolf 2026 competition entry**

*ARC-NeuroGolf / ARC-Genome — June 2026*

**Repository:** [github.com/ilakkmanoharan/ARC-NeuroGolf](https://github.com/ilakkmanoharan/ARC-NeuroGolf)

---

## Abstract

We present **ARC-Genome**, a neural circuit compiler for the [NeuroGolf 2026](https://kaggle.com/competitions/neurogolf-2026) Kaggle competition (IJCAI-ECAI 2026 Competitions Track). The competition asks a question distinct from ARC Prize: not merely *can you solve the task?* but *what is the cheapest neural network that implements the transformation?* Our approach treats each ARC-AGI task as a program to be inferred and compiled into a minimal ONNX graph, rather than a dataset to be trained on.

Over six incremental phases and two milestones, we built a cost-aware synthesis pipeline with 11+ analytical solvers, convolutional fallbacks, composition search, and ARC-GEN synthetic validation. Our central discovery is that **raw solve count is a misleading metric**: of 199 locally "solved" tasks in Phase 6, only 23 generalized to ARC-GEN variants and earned Kaggle points—exactly matching our leaderboard score of 388.20. Re-solving with ARC-GEN gating raised verified tasks to 52 with an estimated score of 843. This paper documents the competition, our methodology, each development phase, and what we have accomplished.

---

## 1. The Competition

### 1.1 NeuroGolf 2026

The **2026 NeuroGolf Championship** is a Kaggle research competition with $50,000 in prizes, affiliated with IJCAI-ECAI 2026. Participants must solve tasks from the **ARC-AGI public training set v1**—400 grid-transformation puzzles—and submit one ONNX neural network per task.

The competition reframes ARC through the lens of **minimum description length (MDL)**:

```text
score(task) = max(1, 25 − ln(cost))
cost        = num_parameters + memory_bytes
```

A network earns points only if it is **functionally correct** across:

- Original ARC-AGI train and test pairs
- ARC-GEN-100K synthetic variants (procedural generators aligned to each task)
- A private held-out benchmark suite

Wrong networks score zero. Cheap correct networks score up to ~20 points per task.

### 1.2 Hard Constraints

| Constraint | Implication |
|---|---|
| Static tensor shapes only | All dimensions fixed at compile time; typical canvas is 30×30×10 one-hot |
| Banned ONNX ops: Loop, Scan, NonZero, Unique, Script, Function | No dynamic control flow; graphs must be finite and explicit |
| Max 1.44 MB per ONNX file | Binding only for bloated conv weights |
| At most one `taskNNN.onnx` per task in `submission.zip` | Sparse submissions are allowed |

### 1.3 What Makes This Hard

Three forces interact:

1. **Correctness** — The network must implement the true transformation rule, not memorize training pairs.
2. **Generalization** — Kaggle tests against ARC-GEN procedural variants; conv least-squares on 3–4 examples often overfits.
3. **Cost** — Score is logarithmic in circuit size; a hand-compiled color map (~100 bytes) beats a 29×29 convolution (~10⁷ MACs) by orders of magnitude.

The leaderboard leader at ~7,700 points implies hundreds of tasks solved with near-analytical circuits averaging ~19 points each. Our initial submission scored 346.95 with 293 tasks—average 1.18 points per task, indicating almost all wins were expensive, barely-scoring convolutions.

---

## 2. The Problem We Are Trying to Solve

### 2.1 Formal Statement

Given an ARC task \(T\) with training pairs \((x_i, y_i)\) and a test input \(x_{\text{test}}\), find a neural network \(f_\theta\) such that:

```text
f_θ(x) = y   for all train and test examples
cost(θ) is minimized
θ is expressible as a valid static ONNX graph
```

We seek not a universal model, but **400 task-specific minimal circuits**—one per puzzle.

### 2.2 The Compiler Hypothesis

We reject the train-then-compress paradigm. Instead:

```text
ARC examples  →  infer transformation φ  →  compile φ to minimal ONNX  →  validate
```

Each task implements an operator \(\varphi : \text{Grid} \to \text{Grid}\). The **genome** is a minimal program:

```text
Genome = (operator_sequence, parameters)
ONNX   = compile(Genome)
```

Intelligence lives in program synthesis upstream; the ONNX file is the compiled artifact.

### 2.3 The Two Metrics That Matter

Early development optimized the wrong objectives. We now track two distinct metrics:

| Metric | Definition | Why it matters |
|---|---|---|
| **Solve count** | ONNX files that pass local train+test validation | Coverage; upper bound on potential score |
| **pass_all count** | Tasks passing train + test + ARC-GEN (30 samples) | Actual Kaggle earners |

These diverge dramatically. Phase 6 solved 199 tasks locally but only 23 earned points on Kaggle.

---

## 3. System Architecture

### 3.1 Repository Structure

```text
arc_genome/
├── config.py          # Cumulative phase flags (levels 1–6)
├── data/
│   ├── encoding.py    # Task loading, one-hot grid encoding
│   ├── arcgen.py      # ARC-GEN validation gate
│   └── normalize.py   # Content bounding-box normalization
├── genome/
│   ├── infer.py       # Per-task orchestrator, cost-gated selection
│   ├── ops/
│   │   ├── analytical.py   # 11 Tier-0 solvers (identity, color_map, transpose, …)
│   │   ├── extended.py     # translate, scale_down, pad_embed, … (Phase 3)
│   │   ├── family.py       # Parameterized family solvers (Phase 3)
│   │   └── conv.py         # Least-squares conv fallbacks
│   └── compose/       # Depth-limited composition search (Phase 4)
├── onnx/
│   ├── model.py       # ONNX builder and local validator
│   ├── cost.py        # Local cost estimator
│   └── kaggle_score.py # Official ORT-profiler scorer (ported)
└── solve.py           # Batch solve + zip packaging

scripts/               # run_phase.py, audit_submission.py, run_milestone1b.py, …
phases/                # Per-phase papers, results, submissions
data/                  # all_tasks.json, arc_gen.json, arc_gen_raw/
reference/             # Ported validators from rogermt/neurogolf-solver
```

### 3.2 Inference Pipeline

For each task, `infer.py` runs a **multi-candidate search**:

1. Try analytical solvers (cheap structural ONNX: Gather, Slice, Transpose)
2. Try extended and family solvers (Phase 3+)
3. Try composition chains up to depth 3 (Phase 4+)
4. Fall back to conv least-squares with kernel budget cap (Phase 2+)
5. Second pass with extended budget for unsolved tasks (Phase 5+)

Candidates are validated, cost-scored, and the cheapest passing candidate wins. When ARC-GEN validation is active (Phase 6+), candidates must also pass 30 synthetic variants.

### 3.3 I/O Convention

Community standard (de facto):

- Input/output: `[1, 10, 30, 30]` float32 one-hot (10 ARC colors, channel 0 = background)
- ONNX opset 10, IR version 10
- Typical analytical pipeline: `Gather` or `Slice → Pad`
- Typical conv pipeline: `Slice → Conv → ArgMax → OneHot → Pad`

---

## 4. Development Phases

We implemented six cumulative phases, each enabling new compiler flags via `config.py`. Later phases inherit all prior capabilities.

### Phase 1: Calibrated Cost Metrology

**Theme:** Build instruments that measure circuit cost correctly.

**Theory.** Without accurate local scoring, optimization is blind. Our v0.1.1 submission scored 346.95 on Kaggle while local estimates predicted ~2,700—an 8× discrepancy. Phase 1 introduced shape-aware MAC accounting, memory estimation, cost-gated candidate rejection (minimum score 8.0), and calibration probe models.

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 294/400 |
| Kaggle score | 369.42 |
| Solver mix | 124 conv_var, 123 conv_fixed, 42 conv_diff, 6 analytical |

**Outcome.** Phase 1 maximized coverage but revealed that most wins were bloated convolutions. It laid metrological groundwork; score improvement came from later phases rejecting expensive candidates.

---

### Phase 2: Structural Compilation — Killing Expensive Conv

**Theme:** Prefer structural ONNX; cap conv kernel search.

**Theory.** Least-squares conv fitting is a universal approximator on ARC grids, but universality is expensive. A 29×29 conv on 30×30×10 costs ~75M MACs per layer. Phase 2 introduced:

- Kernel budget: search only {1, 3, 5, 7, 9, 11}; reject 13+
- Content normalization: crop to tight bounding boxes before matching
- Weight sparsification: prune near-zero weights, shrink kernel to minimal bounding box
- Conditional Pad: skip when output already fills 30×30
- Prefer structural: cost-ordered candidate selection

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 199/400 (−95 from Phase 1) |
| Zip size | 1.1 MB (was 3.5 MB) |
| Kaggle score | 388.20 |

**Outcome.** Sacrificing 95 tasks *increased* Kaggle score from 369 to 388. The competition rewards cheap correct circuits, not raw coverage. This was the first evidence that fewer, better tasks beat more, worse tasks.

---

### Phase 3: Analytical Genome Expansion

**Theme:** Grow the operator basis from 11 to 18+ primitives plus family solvers.

**Theory.** Top leaderboard teams solve ~200 tasks analytically at near-zero cost; we had 6. New primitives: `translate`, `scale_down`, `pad_embed`, `mask_preserve`, `mirror_complete`. Family solvers search parameterized configuration spaces (`color_then_translate`, `extract_recolor`).

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 199/400 (no change) |
| Kaggle score | 388.20 |
| New analytical wins | 0 |

**Outcome.** Implementation gap: extended solvers were wired but contributed zero new wins. Coverage unchanged; same Kaggle score. Identified as priority for Milestone 2.

---

### Phase 4: Compositional Program Search

**Theme:** Search depth-limited chains of numpy primitives, emit minimal Gather ONNX.

**Theory.** Many ARC tasks are not atomic transforms but chains: `rot90 → tile2x2 → color_map`. Search space: 9 primitives, depth ≤ 3 → ~729 chains per task. Verify in program space; emit in circuit space.

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 199/400 (no change) |
| Kaggle score | 388.20 |
| New compositional wins | 0 |

**Outcome.** Composition search ran but found no tasks that analytical + conv had missed. Either the primitive basis is insufficient or verification logic needs debugging.

---

### Phase 5: Hard Task Recovery

**Theme:** Two-speed compilation—fast pass for all tasks, slow second pass for failures.

**Theory.**

```text
Pass 1 (fast):  analytical + conv(kernel ≤ 7), 25s budget
Pass 2 (slow):  conv_v2(kernel ≤ 11), 90s budget, unsolved only
```

Conv v2 sequentially attempts fixed, variable, and diffshape strategies with extended kernels.

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 199/400 (no change) |
| Kaggle score | 388.20 |

**Outcome.** Second pass recovered no additional tasks beyond Phase 2's first pass. The 201 unsolved tasks are not kernel-budget problems—they require genuine analytical insight or better search.

---

### Phase 6: Generalization Hardening + Cost Audit

**Theme:** ARC-GEN validation gate; full cost audit replacing expensive wins.

**Theory.** Conv least-squares on 3–4 train pairs can memorize without learning φ. Accept model only if:

```text
verify(train) ∧ verify(test) ∧ verify(arc_gen_samples)
```

Cost audit re-runs the full solver chain and replaces solutions only when a cheaper equivalent is found.

**Results.**

| Metric | Value |
|---|---|
| Tasks solved | 199/400 |
| Kaggle score | 388.20 |
| Solver mix | 87 conv_fixed, 66 conv_var, 40 conv_diff, 6 analytical |

**Outcome.** Phase 6 matched Phase 2–5 on Kaggle but added the ARC-GEN gate infrastructure. The audit (Milestone 1) later revealed that 176 of 199 "solved" tasks were `train_only` overfits scoring zero on Kaggle.

---

## 5. Milestones: Fixing Measurement

Phases 1–6 optimized against incomplete information. Milestones address the measurement crisis.

### Milestone 1: Stop Flying Blind

**Discovery.** The official Kaggle scorer (ported from `rogermt/neurogolf-solver`) uses:

```text
cost  = memory_bytes + params     (MACs NOT in the score formula)
score = max(1, 25 − ln(cost))
memory = ONNX Runtime profiler peak tensor footprints
```

Our local `cost.py` incorrectly added MACs and estimated memory instead of profiling. This explained the 5.7× gap between local predictions (~2,230) and Kaggle reality (388).

**Audit tiers.**

| Tier | Count (Phase 6) | Meaning |
|---|---|---|
| **pass_all** | **23** | Train + test + ARC-GEN ✓ → earns Kaggle points |
| train_only | 176 | Train + test ✓, ARC-GEN ✗ → scores 0 |
| fail | 0 | Does not pass train/test |

```text
pass_all official score sum = 388.20  ← exactly matches Kaggle leaderboard
```

**Curated submission.** We submitted only the 23 `pass_all` tasks. Kaggle score: **388.20** (unchanged from Phase 6 full zip, confirming the audit).

**Infrastructure built.**

- `arc_genome/onnx/kaggle_score.py` — official ORT-profiler scoring
- `data/arc_gen_raw/` — ARC-GEN-100K (400 tasks × ~262 samples each)
- `scripts/audit_submission.py` — per-task tier tagging
- `scripts/run_milestone1.py` — audit → curate → submit

---

### Milestone 1b: Re-solve with ARC-GEN Gate

**Goal.** Re-run the full solver with ARC-GEN validation enforced at acceptance time, not just at audit time. Use ARC-GEN samples in conv fitting (`_fitting_examples`) so conv weights generalize.

**Results.**

| Metric | Phase 6 audit | M1b re-solve |
|---|---|---|
| Tasks in zip | 199 | 52 |
| pass_all | 23 | **52** |
| train_only | 176 | 0 |
| Estimated Kaggle score | 388.20 | **843.45** |
| Runtime | — | 43 min |

**Solver distribution (52 tasks).**

| Solver | Count |
|---|---|
| conv_diff | 23 |
| conv_fixed | 16 |
| conv_var | 7 |
| color_map | 4 |
| transpose | 2 |

**Status.** Solve and audit completed successfully. Kaggle submission of `submission_v2.zip` failed with HTTP 400 (likely daily submission rate limit after 14 submissions on June 12). Zip is ready for manual retry.

**Significance.** ARC-GEN gating more than doubled verified tasks (23 → 52) and estimated score (388 → 843) while *reducing* zip size (199 → 52 files). Quality beats quantity.

---

## 6. What We Have Accomplished

### 6.1 Technical Deliverables

- **Neural circuit compiler** (`arc_genome/`) with 11 analytical solvers, extended ops, family templates, composition search, and conv fallbacks
- **Cumulative phase system** — six incremental capability levels with per-phase papers and reproducible `run_phase.py` workflow
- **Official scorer integration** — local predictions now align with Kaggle for `pass_all` tasks
- **ARC-GEN validation pipeline** — 400 tasks indexed, 30-sample gate per task, audit tooling
- **Submission hygiene** — validated zip packaging, tier audit, curated submit workflow

### 6.2 Empirical Findings

1. **Conv dominance is a trap.** 97% of Phase 6 wins were convolutions scoring ~1–3 points on Kaggle. Six analytical tasks contributed disproportionate value.

2. **Local solve count ≠ Kaggle score.** 199 solved → 23 earning. The 176 `train_only` tasks were dead weight.

3. **Fewer tasks can score higher.** Phase 1 (294 tasks, 369 pts) < Phase 2–6 (199 tasks, 388 pts) < M1b (52 tasks, ~843 pts est.).

4. **ARC-GEN gate is essential.** Without it, the compiler optimizes for memorization. With it, every submitted task is a genuine earner.

5. **Extended solvers need debugging.** Phases 3–4 added significant code but zero new wins—implementation gap, not theory gap.

### 6.3 Competition Progress

| Submission | Tasks | Kaggle Score | Notes |
|---|---|---|---|
| v0.1.1 | 293 | 346.95 | Baseline; bloated convs |
| Phase 1 | 294 | 369.42 | Best coverage; still conv-heavy |
| Phases 2–6 | 199 | 388.20 | Cheaper circuits; 23 actually earn |
| Milestone 1 (curated) | 23 | 388.20 | Confirmed audit = leaderboard |
| Milestone 1b | 52 | ~843 (est.) | Not yet submitted |

**Progress ratio:** 388 → 843 is 2.2× on verified tasks. Target of 2,000 requires ~150+ tasks at average score 13+.

---

## 7. Lessons Learned

### 7.1 Optimize the Right Objective

The competition score is a product:

```text
E[total score] = Σ pass_all_tasks  score(task)
```

Maximizing solve count while ignoring generalization and cost optimizes a proxy that diverges from the true objective. **pass_all × official_score** is the quantity to maximize.

### 7.2 Analytical Before Conv

Every analytical win is worth 10–20× a conv win. The compiler should exhaust structural search before touching least-squares fitting. Our pipeline order is correct; our analytical *coverage* is not.

### 7.3 Measurement Before Optimization

Phase 1's metrology work seemed unglamorous but Milestone 1 proved it was prerequisite. You cannot optimize cost you cannot measure. The official scorer must gate all acceptance decisions.

### 7.4 Generalization Is the Hidden Test

ARC-GEN-100K is not optional decoration—it is the filter between "fits training pairs" and "implements the rule." 88% of our conv solutions failed this filter.

---

## 8. Path Forward

From `private/path-to-2000.md`, the realistic trajectory:

| Milestone | pass_all tasks | Est. score | Key lever |
|---|---|---|---|
| Current (M1b) | 52 | ~843 | ARC-GEN gate active |
| M2 | 80+ | ~1,200 | Fix extended solvers; 10 new analytical primitives |
| M3 | 120+ | ~1,600 | Family solvers + composition debugging |
| M4 | 150+ | ~2,000 | Near-analytical coverage on procedural ARC-GEN tasks |

**Immediate next steps:**

1. Submit M1b when Kaggle rate limit resets
2. Debug why Phase 3–4 extended solvers produce zero wins
3. Add 10 high-ROI analytical solvers (crop, split, fill, border, object extract)
4. Use `kaggle_score.py` (not `cost.py`) for all cost-gating decisions
5. Grow `pass_all` count, not raw solve count

---

## 9. Conclusion

ARC-Genome reframes NeuroGolf as a **compilation problem**: infer the transformation, emit the minimal circuit, verify generalization. Our six-phase development taught us that the competition punishes conv overfitting severely—only 12% of locally solved tasks actually earn points. Milestone 1b demonstrates that enforcing ARC-GEN validation during synthesis, not just audit, can more than double verified score while submitting fewer files.

We have built the infrastructure to stop flying blind: official scoring, synthetic validation, tier audits, and a reproducible phased compiler. The remaining gap to leaderboard class (~7,700) is analytical coverage: discovering and compiling the structural rules that hundreds of ARC tasks share, rather than fitting them away with convolution.

The genome is not yet fully sequenced—but we now know how to read it.

---

## References

- ARC-Genome source code. https://github.com/ilakkmanoharan/ARC-NeuroGolf
- Moffitt, M. D., et al. *The 2026 NeuroGolf Championship.* Kaggle, 2026. https://kaggle.com/competitions/neurogolf-2026
- Chollet, F. *On the Measure of Intelligence.* arXiv:1911.01547, 2019. (ARC-AGI benchmark)
- ARC Prize Foundation. https://arcprize.org
- `rogermt/neurogolf-solver` — official validator and scorer reference implementation
- `google/ARC-GEN` — procedural generators for ARC-AGI tasks (ARC-GEN-100K)

---

## Appendix A: Phase Configuration Flags

| Level | Flags enabled |
|---|---|
| 1 | `calibrated_cost`, `cost_gate_min_score=8` |
| 2 | `max_kernel=11`, `content_normalize`, `conv_sparsify`, `prefer_structural` |
| 3 | `extended_analytical`, `family_solvers` |
| 4 | `composition_depth=3` |
| 5 | `conv_v2`, `second_pass`, `unsolved_budget=90` |
| 6 | `arcgen_validation`, `cost_audit` |

## Appendix B: Analytical Solver Inventory (Tier 0)

`identity`, `constant`, `color_map`, `transpose`, `flip`, `rotate`, `tile`, `upscale`, `concat`, `spatial_gather`, `crop`

## Appendix C: Key Commands

```bash
# Run a phase (solve + zip + Kaggle submit)
python scripts/run_phase.py 6

# Audit a submission for pass_all / train_only / fail tiers
python scripts/audit_submission.py --submission_dir phases/phase6/submission

# Milestone 1: curate pass_all tasks and submit
python scripts/run_milestone1.py

# Milestone 1b: re-solve with ARC-GEN gate
python scripts/run_milestone1b.py
```
