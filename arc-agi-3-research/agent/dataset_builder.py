from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.config import AgentConfig
from agent.log_parser import LogAnalysis, ParsedTransition


def _dataset_paths(config: AgentConfig, day: str) -> dict[str, Path]:
    base = config.research_root / "datasets" / day
    base.mkdir(parents=True, exist_ok=True)
    return {
        "action_effect": base / "dataset1_action_effect_cycle.jsonl",
        "exploration": base / "dataset2_exploration_cycle.jsonl",
        "failure_revision": base / "dataset3_failure_revision_cycle.jsonl",
        "trace": base / "dataset7_trace_cycle.jsonl",
        "manifest": base / "manifest.json",
    }


def _action_effect_row(transition: ParsedTransition, label: str) -> dict[str, Any]:
    return {
        "input": {
            "state_hash": transition.state_hash,
            "action": transition.action,
            "diff_summary": transition.diff_summary,
            "num_changed_cells": transition.num_changed_cells,
        },
        "output": label,
        "source": "arc-agi-3-research-cycle",
    }


def _exploration_row(
    transition: ParsedTransition,
    hypotheses: list[str],
    next_action: str,
    visit_count: int,
) -> dict[str, Any]:
    return {
        "dataset": "next_action_v0",
        "instruction": "Recommend the next action given exploration context.",
        "input": {
            "frontier_summary": {
                "visit_count_current_state": visit_count,
                "policy": "arc_agi_3_research_cycle",
            },
            "last_transitions": [
                {
                    "action": transition.action,
                    "state_hash": transition.state_hash[:12],
                    "changed_cells": transition.num_changed_cells,
                }
            ],
            "hypotheses": hypotheses,
        },
        "output": next_action,
        "source": "arc-agi-3-research-cycle",
    }


def _failure_row(
    *,
    failed_hypothesis: str,
    observation: str,
    revision: str,
) -> dict[str, Any]:
    return {
        "input": {
            "failed_hypothesis": failed_hypothesis,
            "observation": observation,
        },
        "output": revision,
        "source": "arc-agi-3-research-cycle",
    }


def _trace_row(
    *,
    submission_id: str,
    score: str | float | None,
    steps: list[dict[str, str]],
) -> dict[str, Any]:
    return {
        "input": {
            "submission_id": submission_id,
            "score": score,
            "reasoning_history": steps,
        },
        "output": "revise_exploration_policy",
        "source": "arc-agi-3-research-cycle",
    }


def append_jsonl(path: Path, rows: list[dict[str, Any]]) -> int:
    if not rows:
        return 0
    with path.open("a", encoding="utf-8") as handle:
        for row in rows:
            handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    return len(rows)


def export_cycle_datasets(
    config: AgentConfig,
    *,
    day: str,
    log_analysis: LogAnalysis,
    submission_id: str,
    submission_score: str | float | None,
    lora_labels: dict[str, str],
    exploration_plan: list[str],
    failure_revision: str,
) -> dict[str, Path]:
    paths = _dataset_paths(config, day)
    action_rows: list[dict[str, Any]] = []
    exploration_rows: list[dict[str, Any]] = []
    failure_rows: list[dict[str, Any]] = []

    for transition in log_analysis.transitions:
        key = f"{transition.state_hash[:16]}|{transition.action}"
        label = lora_labels.get(key, "small_change")
        action_rows.append(_action_effect_row(transition, label))
        if exploration_plan:
            exploration_rows.append(
                _exploration_row(
                    transition,
                    hypotheses=[label],
                    next_action=exploration_plan[0],
                    visit_count=log_analysis.action_counts.get(transition.action, 1),
                )
            )

    if failure_revision:
        failure_rows.append(
            _failure_row(
                failed_hypothesis="score_stuck_at_zero",
                observation=log_analysis.to_context()[:1500],
                revision=failure_revision,
            )
        )

    trace_steps = [
        {"step": "observe", "detail": f"score={submission_score}"},
        {"step": "hypothesize", "detail": failure_revision or "improve_lora_coverage"},
        {"step": "plan", "detail": "; ".join(exploration_plan[:3])},
    ]
    trace_row = _trace_row(
        submission_id=submission_id,
        score=submission_score,
        steps=trace_steps,
    )

    counts = {
        "dataset1_action_effect": append_jsonl(paths["action_effect"], action_rows),
        "dataset2_exploration": append_jsonl(paths["exploration"], exploration_rows),
        "dataset3_failure_revision": append_jsonl(paths["failure_revision"], failure_rows),
        "dataset7_trace": append_jsonl(paths["trace"], [trace_row]),
    }

    manifest = {
        "day": day,
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "submission_id": submission_id,
        "row_counts": counts,
        "asra_lora_merge_hint": (
            "Append cycle JSONL files to ASRA-LoRA data/generated/ and re-run "
            "train/hypothesis_lora_sft.py (and future Exploration/Failure/Trace trainers)."
        ),
        "files": {k: str(v.relative_to(config.repo_root)) for k, v in paths.items()},
    }
    paths["manifest"].write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return paths
