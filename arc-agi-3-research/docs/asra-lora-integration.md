# ASRA-LoRA integration

The research agent uses **ASRA-LoRA adapters** to close the loop between Kaggle logs, strategy, notebook submission, and dataset retraining.

## Loop

```text
Kaggle logs
  → parse transitions (log_parser)
  → HypothesisLoRA labels (or heuristic fallback)
  → ExplorationLoRA (when `adapters/exploration-lora-v0/` exists) / Failure / Trace advisors (rules until D3/D7 trainers ship)
  → analysis + hypothesis + strategy markdown
  → export cycle JSONL → research/datasets/{day}/
  → apply strategy to notebook (Phase 7 bootstrap + LoRA stamp + cache embed)
  → Kaggle submit
  → merge JSONL into ASRA-LoRA → retrain adapters
```

## Adapters

| Adapter | Role in agent | Training data |
|---------|---------------|---------------|
| **HypothesisLoRA** | Label action effects from logs | D1 + cycle `dataset1_action_effect_cycle.jsonl` |
| **ExplorationLoRA** | Plan next actions (LoRA when weights exist) | D2 + cycle `dataset2_exploration_cycle.jsonl` |
| **FailureLoRA** | Revise policy when score stuck (rules) | D3 + cycle `dataset3_failure_revision_cycle.jsonl` |
| **TraceLoRA** | Full reasoning trace per cycle (rules) | D7 + cycle `dataset7_trace_cycle.jsonl` |

## Environment

```text
ARC_AGENT_USE_LORA=1                          # default on
ASRA_LORA_REPO=/path/to/ASRA-LoRA            # local or CI checkout
HYPOTHESIS_LORA_ADAPTER_DIR=.../hypothesis-lora-v0
LORA_CACHE_EMBED_PATH=.../hypothesis_lora_kaggle_cache_embed.py
LORA_INFERENCE_MODE=auto|heuristic            # CI uses heuristic (no GPU)
KAGGLE_BASE_KERNEL=ilakkmanoharan/asra-phase-7-arc-prize-2026
```

## Retrain after a cycle

**HypothesisLoRA:**

```bash
cd /path/to/ASRA-LoRA
cat ../ilakk-manoharan/arc-agi-3-research/research/datasets/*/dataset1_action_effect_cycle.jsonl \
  >> data/generated/dataset1_action_effect_v0.jsonl
python3 train/hypothesis_lora_sft.py --dataset dataset1_action_effect_v0.jsonl
bash scripts/run_lora_pipeline.sh   # export cache + sync Phase 7
```

**ExplorationLoRA (cloud — Kaggle GPU):**

1. Merge cycle exports into D2, then run [Train ExplorationLoRA](https://github.com/ilakkmanoharan/ASRA-LoRA/actions/workflows/train-exploration-lora.yml) on ASRA-LoRA (needs `KAGGLE_API_TOKEN` secret).
2. Download the workflow artifact to `adapters/exploration-lora-v0/`, or enable **commit weights** on the workflow.
3. Next daily ARC-AGI-3 run picks up ExplorationLoRA automatically when weights are present in the ASRA-LoRA checkout.

```bash
cat ../ilakk-manoharan/arc-agi-3-research/research/datasets/*/dataset2_exploration_cycle.jsonl \
  >> data/generated/dataset2_next_action_v0.jsonl
python3 scripts/cloud_train_exploration_lora.py --max-rows 4000 --max-steps 100
```

SciLayer concept paper: https://sci-layer.vercel.app/articles/asra-lora-adaptive-scientific-reasoning-lora-fine-tuning
