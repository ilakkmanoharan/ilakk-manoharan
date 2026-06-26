from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.config import AgentConfig


def update_portfolio_manifest(config: AgentConfig, timeline_data: dict[str, Any]) -> Path:
    """Write a manifest consumed by the portfolio research page."""
    events = timeline_data.get("events", [])
    latest = events[-1] if events else None

    manifest: dict[str, Any] = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "competition": timeline_data.get("competition"),
        "competition_url": timeline_data.get("competition_url"),
        "research_end": timeline_data.get("research_end"),
        "latest_submission_id": timeline_data.get("latest_submission_id"),
        "latest_score": timeline_data.get("latest_score"),
        "latest_hypothesis_path": timeline_data.get("latest_hypothesis_path"),
        "latest_strategy_path": timeline_data.get("latest_strategy_path"),
        "event_count": len(events),
        "latest_event": latest,
        "events": events[-50:],
    }

    out = config.research_root / "portfolio-manifest.json"
    out.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return out


_PLACEHOLDER_SUBMISSION_IDS = frozenset({"dry-run", "pending", ""})


def write_status_summary(
    config: AgentConfig,
    timeline_data: dict[str, Any],
    *,
    submit_result: dict[str, Any] | None = None,
    notebook_note: str | None = None,
) -> Path:
    """Human-readable snapshot for the portfolio status dashboard."""
    events = timeline_data.get("events", [])
    last_cycle = next(
        (e for e in reversed(events) if e.get("event_type") == "cycle_completed"),
        None,
    )
    last_submit = next(
        (
            e
            for e in reversed(events)
            if e.get("event_type") in {"submission_created", "resubmitted"}
            and e.get("status") in {"SUBMITTED", "COMPLETE", "COMPLETED"}
        ),
        None,
    )

    hypothesis_one_liner = (
        "Improving transition logging and action-semantics recovery "
        "will raise milestone scores."
    )
    hypothesis_path = timeline_data.get("latest_hypothesis_path")
    if hypothesis_path:
        hp = config.repo_root / hypothesis_path
        if hp.exists():
            text = hp.read_text(encoding="utf-8")
            for line in text.splitlines():
                if line.startswith("Improving ") or line.startswith("Extend "):
                    hypothesis_one_liner = line.strip()
                    break

    summary: dict[str, Any] = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "public_score": timeline_data.get("latest_score"),
        "latest_submission_id": timeline_data.get("latest_submission_id"),
        "agent_auto_submit": True,
        "next_cycle_utc": "14:00 UTC daily (GitHub Actions)",
        "notebook_status": notebook_note or "arc_agi_3_next_submission.ipynb (ASRA Phase 4 bootstrap)",
        "current_hypothesis": hypothesis_one_liner,
        "planned_direction": (
            "ASRA-LoRA loop: HypothesisLoRA labels logs → Exploration/Failure/Trace "
            "adapters plan next actions → notebook uses Phase 7 + LoRA cache → "
            "cycle JSONL merges into retraining corpora"
        ),
        "planned_direction_url": (
            "https://sci-layer.vercel.app/articles/"
            "asra-lora-adaptive-scientific-reasoning-lora-fine-tuning"
        ),
        "last_cycle_status": (last_cycle or {}).get("status") or (last_cycle or {}).get("summary"),
        "last_agent_submission": {
            "submission_id": (last_submit or {}).get("submission_id")
            or (submit_result or {}).get("submission_id"),
            "status": (last_submit or {}).get("status")
            or (submit_result or {}).get("status"),
            "kernel_slug": ((last_submit or {}).get("extra") or {}).get("kernel_slug")
            or (submit_result or {}).get("kernel_slug"),
            "summary": (last_submit or {}).get("summary")
            or (submit_result or {}).get("note"),
        },
        "submission_history": [
            {
                "name": "ARC AGI 3 Research Agent — v1",
                "date": "2026-06-24",
                "score": "0.00",
                "status": "Succeeded",
                "note": "First agent auto-submit; ASRA Phase 4 notebook under new kernel",
            },
            {
                "name": "ASRA Phase 4 — v4",
                "date": "2026-06-17",
                "score": "0.00",
                "status": "Succeeded",
                "note": "Fix missing CausalSemanticsEngine",
            },
            {
                "name": "ASRA Phase 4 — v3",
                "date": "2026-06-16",
                "score": "—",
                "status": "Kaggle Error",
                "note": "Official gateway pattern",
            },
            {
                "name": "ASRA Phase 3 — v2",
                "date": "2026-06-15",
                "score": "0.00",
                "status": "Succeeded",
                "note": "Official gateway pattern",
            },
        ],
        "known_blockers": [
            "ExplorationLoRA / FailureLoRA / TraceLoRA trainers: ExplorationLoRA shipped; others rule-based until D3/D7",
            "HypothesisLoRA requires ASRA-LoRA repo or adapter weights on runner",
            "Public score 0.00 until Phase 7 + LoRA bridge solves games",
        ],
    }

    out = config.research_root / "status-summary.json"
    out.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    return out


def sync_timeline_summary_fields(
    timeline_data: dict[str, Any],
    *,
    submission_id: str | None = None,
    score: str | float | None = None,
    hypothesis_path: str | None = None,
    strategy_path: str | None = None,
) -> dict[str, Any]:
    if submission_id is not None and submission_id not in _PLACEHOLDER_SUBMISSION_IDS:
        timeline_data["latest_submission_id"] = submission_id
    if score is not None:
        timeline_data["latest_score"] = score
    if hypothesis_path is not None:
        timeline_data["latest_hypothesis_path"] = hypothesis_path
    if strategy_path is not None:
        timeline_data["latest_strategy_path"] = strategy_path
    return timeline_data
