from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4

from agent.config import EVENT_TYPES, AgentConfig


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _iso_date(dt: datetime) -> str:
    return dt.strftime("%Y-%m-%d")


def _iso_time(dt: datetime) -> str:
    return dt.strftime("%H:%M:%S")


class TimelineStore:
    def __init__(self, config: AgentConfig) -> None:
        self.config = config
        self.path = config.research_root / "timeline.json"

    def load(self) -> dict[str, Any]:
        if not self.path.exists():
            return {
                "version": 1,
                "competition": self.config.competition,
                "events": [],
            }
        return json.loads(self.path.read_text(encoding="utf-8"))

    def save(self, data: dict[str, Any]) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(
            json.dumps(data, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

    def append_event(
        self,
        event_type: str,
        *,
        submission_id: str | None = None,
        status: str | None = None,
        score: str | float | None = None,
        kaggle_url: str | None = None,
        github_documents: list[str] | None = None,
        summary: str = "",
        extra: dict[str, Any] | None = None,
    ) -> dict[str, Any]:
        if event_type not in EVENT_TYPES:
            raise ValueError(f"Unknown event_type: {event_type}")

        now = _utc_now()
        event: dict[str, Any] = {
            "id": str(uuid4()),
            "date": _iso_date(now),
            "time": _iso_time(now),
            "event_type": event_type,
            "submission_id": submission_id or "",
            "status": status or "",
            "score": "" if score is None else str(score),
            "kaggle_url": kaggle_url or "",
            "github_documents": github_documents or [],
            "summary": summary,
        }
        if extra:
            event["extra"] = extra

        data = self.load()
        events = data.setdefault("events", [])
        events.append(event)
        self.save(data)
        return event

    def day_dir(self, kind: str, day: str | None = None) -> Path:
        day = day or _iso_date(_utc_now())
        path = self.config.research_root / kind / day
        path.mkdir(parents=True, exist_ok=True)
        return path

    def relative_paths(self, *paths: Path) -> list[str]:
        return [
            str(p.relative_to(self.config.repo_root)).replace("\\", "/")
            for p in paths
        ]
