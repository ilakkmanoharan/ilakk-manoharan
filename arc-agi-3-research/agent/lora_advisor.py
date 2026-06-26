from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from agent.config import AgentConfig
from agent.log_parser import LogAnalysis
from agent.lora_client import (
    classify_transitions_with_hypothesis_lora,
    exploration_plan_from_labels,
    failure_revision_from_score,
    resolve_adapter_dir,
    resolve_asra_lora_repo,
)


@dataclass
class LoraAdvisorResult:
    labels: dict[str, str]
    classification_mode: str
    exploration_plan: list[str]
    failure_revision: str
    hypothesis: str
    intervention: str
    notebook_modifications: str
    architecture_changes: str
    feature_additions: str
    ablations: str
    experiment_plan: str
    adapter_note: str


def advise_from_logs(
    config: AgentConfig,
    *,
    log_analysis: LogAnalysis,
    submission_score: str | float | None,
    submission_status: str,
) -> LoraAdvisorResult:
    labels, mode = classify_transitions_with_hypothesis_lora(
        config, log_analysis.transitions
    )
    exploration, exploration_mode = exploration_plan_from_labels(
        config, labels, log_analysis
    )
    failure_revision = failure_revision_from_score(submission_score, log_analysis)

    adapter_dir = resolve_adapter_dir(config)
    repo = resolve_asra_lora_repo(config)
    adapter_note = (
        f"HypothesisLoRA: {adapter_dir or 'heuristic only'} "
        f"(ASRA-LoRA repo: {repo or 'not found'})"
    )

    dead_end_ratio = 0.0
    if labels:
        dead = sum(1 for v in labels.values() if v in {"dead_end", "no_change"})
        dead_end_ratio = dead / len(labels)

    hypothesis = (
        "LoRA adapters trained on transition traces will improve ARC-AGI-3 "
        "action-semantics recovery and raise milestone scores faster than "
        "static ASRA heuristics alone."
    )
    if dead_end_ratio > 0.5:
        hypothesis = (
            "High dead-end / no-change ratio in logs — HypothesisLoRA and "
            "ExplorationLoRA should prioritize RESET and untried actions "
            "before repeating failed transitions."
        )

    intervention = (
        "Bootstrap Kaggle notebook from ASRA Phase 7 with HypothesisLoRA cache "
        "bridge; export cycle transition JSONL to ASRA-LoRA datasets; retrain "
        "adapters on merged corpora."
    )

    notebook_modifications = "\n".join(
        [
            "- Bootstrap from `KAGGLE_BASE_KERNEL=ilakkmanoharan/asra-phase-7-arc-prize-2026`",
            "- Package `hypothesis_lora_kaggle_cache_embed.py` with kernel",
            "- Stamp notebook with LoRA intervention cell from strategy",
            "- Log transitions to `research/datasets/{day}/dataset1_action_effect_cycle.jsonl`",
            f"- Next exploration actions (ExplorationLoRA rules): {', '.join(exploration[:4])}",
        ]
    )

    architecture_changes = "\n".join(
        [
            "- HypothesisLoRA: classify action effects from state transitions",
            "- ExplorationLoRA: recommend next action from frontier + transition history",
            "- FailureLoRA (rules until D3 trained): revise policy when score stuck at 0",
            "- TraceLoRA (rules until D7 trained): full observe→hypothesis→revision traces",
            "- Merge cycle JSONL into ASRA-LoRA `data/generated/` for retraining",
        ]
    )

    feature_additions = "\n".join(
        [
            "- Sync HypothesisLoRA Kaggle cache from latest adapter weights",
            "- Directed exploration using LoRA semantic labels",
            "- Auto-export training rows every research cycle",
        ]
    )

    ablations = "\n".join(
        [
            "- HypothesisLoRA on vs heuristic labels",
            "- Phase 7 + LoRA bridge vs Phase 4 baseline",
            "- Exploration plan: RESET-first vs ACTION2-first",
        ]
    )

    experiment_plan = "\n".join(
        [
            "1. Parse Kaggle logs → transition rows (HypothesisLoRA labels)",
            "2. Export cycle datasets for ASRA-LoRA retraining",
            "3. Apply strategy to notebook (Phase 7 + LoRA cache)",
            "4. Submit to Kaggle and monitor score",
            "5. Merge new rows into D1/D2/D3/D7 and retrain adapters",
        ]
    )

    if submission_status.upper() in {"FAILED", "ERROR"}:
        intervention = (
            "Fix kernel/runtime errors first, then re-apply Phase 7 + HypothesisLoRA bridge."
        )

    return LoraAdvisorResult(
        labels=labels,
        classification_mode=f"{mode}+{exploration_mode}",
        exploration_plan=exploration,
        failure_revision=failure_revision,
        hypothesis=hypothesis,
        intervention=intervention,
        notebook_modifications=notebook_modifications,
        architecture_changes=architecture_changes,
        feature_additions=feature_additions,
        ablations=ablations,
        experiment_plan=experiment_plan,
        adapter_note=adapter_note,
    )


def format_lora_analysis_markdown(
    advisor: LoraAdvisorResult,
    log_analysis: LogAnalysis,
) -> dict[str, str]:
    context = log_analysis.to_context()
    lora_section = (
        f"## LoRA advisor\n\n"
        f"- Classification mode: `{advisor.classification_mode}`\n"
        f"- {advisor.adapter_note}\n"
        f"- Labels inferred: {len(advisor.labels)}\n"
        f"- Exploration plan: {', '.join(advisor.exploration_plan)}\n"
        f"- Failure revision: {advisor.failure_revision}\n"
    )
    return {
        "success-analysis.md": (
            "# Success analysis\n\n"
            f"{context}\n\n"
            f"{lora_section}\n"
            "### What worked\n\n"
            "- Gateway submission completed\n"
            "- Transition rows exported for LoRA training\n"
        ),
        "failure-analysis.md": (
            "# Failure analysis\n\n"
            f"{context}\n\n"
            f"{lora_section}\n"
            "### Failure mode\n\n"
            f"{advisor.failure_revision}\n"
        ),
        "causal-analysis.md": (
            "# Causal analysis\n\n"
            f"{context}\n\n"
            f"{lora_section}\n"
            "## Causal chain\n\n"
            "Observation → LoRA labels → Exploration plan → "
            "Notebook intervention → Submission → Score → Retrain adapters\n"
        ),
        "theory.md": (
            "# Theory update\n\n"
            f"{lora_section}\n"
            "## Working theory\n\n"
            "ARC-AGI-3 solving improves when transition-centric LoRA adapters "
            "(Hypothesis, Exploration, Failure, Trace) close the loop between "
            "Kaggle logs, strategy, notebook code, and dataset retraining.\n\n"
            f"## Hypothesis\n\n{advisor.hypothesis}\n\n"
            f"## Intervention\n\n{advisor.intervention}\n"
        ),
    }
