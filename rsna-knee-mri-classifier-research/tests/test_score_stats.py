"""Unit tests for project-page-agent score math and Chicago day windows."""

from __future__ import annotations

import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from project_page_agent import (  # noqa: E402
    Submission,
    compute_score_summary,
    day_window,
    is_eleven_pm_chicago,
)


TZ = ZoneInfo("America/Chicago")


def _sub(ref: str, hour: int, score: float | None) -> Submission:
    return Submission(
        ref=ref,
        timestamp=datetime(2026, 9, 15, hour, 0, 0, tzinfo=TZ),
        file_name="submission.csv",
        description="test",
        status="COMPLETE",
        public_score=score,
        private_score=None,
    )


def test_day_window_chicago():
    start, end = day_window(date(2026, 9, 15))
    assert start.tzinfo == TZ
    assert start.hour == 0
    assert end.day == 15
    assert end.hour == 23


def test_score_summary_improvement():
    subs = [_sub("1", 9, 0.494), _sub("2", 17, 0.498)]
    summary = compute_score_summary(subs, prior_scored=[], prior_best=None, previous_close=None)
    assert summary["firstScored"] == 0.494
    assert summary["lastScored"] == 0.498
    assert abs(summary["dailyAbsoluteChange"] - 0.004) < 1e-12
    assert summary["newAllTimeBest"] is True
    assert summary["scoredCount"] == 2


def test_score_summary_no_submissions():
    summary = compute_score_summary([], prior_scored=[0.5], prior_best=0.5, previous_close=0.5)
    assert summary["scoredCount"] == 0
    assert summary["dailyAbsoluteChange"] is None
    assert summary["newAllTimeBest"] is False


def test_zero_reference_pct_null():
    subs = [_sub("1", 9, 0.0), _sub("2", 10, 0.1)]
    summary = compute_score_summary(subs, [], None, None)
    assert summary["dailyPercentageChange"] is None


def test_eleven_pm_gate():
    assert is_eleven_pm_chicago(datetime(2026, 9, 15, 23, 5, tzinfo=TZ)) is True
    assert is_eleven_pm_chicago(datetime(2026, 9, 15, 22, 5, tzinfo=TZ)) is False
