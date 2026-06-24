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
