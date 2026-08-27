# Theory update

## LoRA advisor

- Classification mode: `empty+heuristic`
- HypothesisLoRA: heuristic only (ASRA-LoRA repo: /home/runner/work/ilakk-manoharan/ilakk-manoharan/ASRA-LoRA)
- Labels inferred: 0
- Exploration plan: ACTION2, ACTION3, Log transition JSONL for LoRA cache refresh, Fix gateway/runtime errors before exploration policy changes
- Failure revision: Runtime errors detected — stabilize notebook imports and CausalSemanticsEngine before policy changes.

## Working theory

ARC-AGI-3 solving improves when transition-centric LoRA adapters (Hypothesis, Exploration, Failure, Trace) close the loop between Kaggle logs, strategy, notebook code, and dataset retraining.

## Hypothesis

LoRA adapters trained on transition traces will improve ARC-AGI-3 action-semantics recovery and raise milestone scores faster than static ASRA heuristics alone.

## Intervention

Bootstrap Kaggle notebook from ASRA Phase 7 with HypothesisLoRA cache bridge; export cycle transition JSONL to ASRA-LoRA datasets; retrain adapters on merged corpora.
