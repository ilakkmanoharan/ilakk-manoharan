#!/usr/bin/env python3
"""Poll Kaggle submission status (2-hour interval workflow)."""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from agent.config import AgentConfig
from agent.cycle import DailyResearchCycle
from agent.kaggle_client import KaggleClient
from agent.timeline import TimelineStore

TERMINAL = {"complete", "completed", "failed", "error", "cancelled"}
POLL_SECONDS = 2 * 60 * 60


def main() -> int:
    parser = argparse.ArgumentParser(description="Monitor Kaggle submission status")
    parser.add_argument("--once", action="store_true", help="Check once and exit")
    parser.add_argument("--max-waits", type=int, default=12)
    args = parser.parse_args()

    config = AgentConfig.from_env(ROOT)
    kaggle = KaggleClient(config)
    timeline = TimelineStore(config)

    waits = 0
    while True:
        if config.has_kaggle():
            submission = kaggle.latest_submission()
        else:
            submission = kaggle.dry_run_submission()

        if submission is None:
            print(json.dumps({"status": "no_submissions"}))
            return 0

        status = submission.status.lower()
        timeline.append_event(
            "status_checked",
            submission_id=submission.submission_id,
            status=submission.status,
            score=submission.score,
            kaggle_url=submission.url,
            summary=f"Status poll: {submission.status}",
        )
        print(
            json.dumps(
                {
                    "submission_id": submission.submission_id,
                    "status": submission.status,
                    "score": submission.score,
                },
                indent=2,
            )
        )

        if status in TERMINAL:
            if status in {"failed", "error", "cancelled", "timeout"}:
                DailyResearchCycle(config).run()
            return 0

        waits += 1
        if args.once or waits >= args.max_waits:
            return 0

        time.sleep(POLL_SECONDS)


if __name__ == "__main__":
    raise SystemExit(main())
