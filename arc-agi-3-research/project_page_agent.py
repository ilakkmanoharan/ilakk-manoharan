#!/usr/bin/env python3
"""ARC-AGI-3 project-page-agent.

Deterministic aggregator for portfolio daily pages + score history:
- research/submissions/YYYY-MM-DD/submission.json
- research/hypotheses/, strategies/, analysis/
- Optional Kaggle API refresh when credentials exist

Writes:
  research/project-page/daily/YYYY-MM-DD.json
  research/project-page/score-history.json

Timezone: America/Chicago. Designed for 11 PM Central via GHA.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import statistics
import sys
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

TZ = ZoneInfo("America/Chicago")
COMPETITION = "arc-prize-2026-arc-agi-3"
PROJECT = "arc-agi-3-research"

ROOT = Path(__file__).resolve().parent
RESEARCH = ROOT / "research"
PAGE = RESEARCH / "project-page"
DAILY_DIR = PAGE / "daily"
SCORE_PATH = PAGE / "score-history.json"
CONFIG_PATH = PAGE / "config.json"
SUBMISSIONS = RESEARCH / "submissions"
HYPOTHESES = RESEARCH / "hypotheses"
STRATEGIES = RESEARCH / "strategies"
ANALYSIS = RESEARCH / "analysis"


def now_chicago() -> datetime:
    return datetime.now(TZ)


def chicago_day(d: date | None = None) -> date:
    return d if d is not None else now_chicago().date()


def day_window(d: date) -> tuple[datetime, datetime]:
    start = datetime(d.year, d.month, d.day, 0, 0, 0, tzinfo=TZ)
    end = start + timedelta(days=1) - timedelta(microseconds=1)
    return start, end


def parse_ts(value: str) -> datetime | None:
    if not value:
        return None
    raw = value.strip().replace("Z", "+00:00")
    try:
        dt = datetime.fromisoformat(raw)
    except ValueError:
        for fmt in ("%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M:%S"):
            try:
                dt = datetime.strptime(value[:26], fmt).replace(tzinfo=timezone.utc)
                break
            except ValueError:
                dt = None
        else:
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(TZ)


def is_eleven_pm_chicago(now: datetime | None = None) -> bool:
    return (now or now_chicago()).hour == 23


def parse_score(raw: Any) -> float | None:
    if raw is None or raw == "" or raw == "—" or raw == "-":
        return None
    try:
        return float(raw)
    except (TypeError, ValueError):
        return None


@dataclass
class Submission:
    ref: str
    timestamp: datetime
    file_name: str
    description: str
    status: str
    public_score: float | None
    private_score: float | None
    strategy: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return {
            "ref": self.ref,
            "timestamp": self.timestamp.astimezone(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z"),
            "fileName": self.file_name,
            "description": self.description,
            "status": self.status,
            "publicScore": self.public_score,
            "privateScore": self.private_score,
            "strategy": self.strategy,
        }


def concepts_from_description(desc: str) -> list[dict[str, str]]:
    if not desc:
        return []
    # Split on + / ; while keeping meaningful tokens
    parts = re.split(r"\s*\+\s*|\s*;\s*", desc)
    out: list[dict[str, str]] = []
    for part in parts:
        name = part.strip(" -–—,.")
        # Drop leading phase tags like "Phase A.1:" but keep rest
        name = re.sub(r"^(Phase\s+[A-Z0-9.]+|P\d+)\s*[:\-–—]\s*", "", name, flags=re.I)
        name = name.strip()
        if len(name) < 3 or len(name) > 120:
            continue
        if name.lower().startswith("arc-agi"):
            continue
        if re.fullmatch(r"(Phase\s+[A-Z0-9.]+|P\d+)", name, flags=re.I):
            continue
        out.append(
            {
                "name": name,
                "why": f"Named in submission description: {desc[:180]}",
                "how": "Not recorded",
            }
        )
    return out[:12]


def load_submission_for_day(day: date) -> list[Submission]:
    folder = SUBMISSIONS / day.isoformat()
    path = folder / "submission.json"
    if not path.exists():
        return []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    ts = parse_ts(str(data.get("submitted_at") or "")) or datetime(
        day.year, day.month, day.day, 12, 0, tzinfo=TZ
    )
    score = parse_score(data.get("score"))
    priv = parse_score(data.get("private_score"))
    desc = str(data.get("description") or "")
    return [
        Submission(
            ref=str(data.get("submission_id") or day.isoformat()),
            timestamp=ts,
            file_name=str(data.get("file_name") or "submission.parquet"),
            description=desc,
            status=str(data.get("status") or "UNKNOWN"),
            public_score=score,
            private_score=priv,
            strategy=None,
        )
    ]


def load_hypotheses(day: date) -> list[dict[str, Any]]:
    path = HYPOTHESES / day.isoformat() / "hypothesis.md"
    if not path.exists():
        return []
    text = path.read_text(encoding="utf-8")
    # Pull first meaningful bullet / heading
    statement = "Not recorded"
    for line in text.splitlines():
        s = line.strip()
        if s.startswith("#") or not s:
            continue
        if s.startswith("- "):
            statement = s[2:].strip()
            break
        if len(s) > 20:
            statement = s[:300]
            break
    return [
        {
            "id": f"H-{day.isoformat()}",
            "statement": statement,
            "motivation": "Derived from daily hypothesis.md",
            "changeBeingTested": "See strategy / submission description",
            "expectedResult": "Not recorded",
            "observedResult": "Not recorded",
            "evidence": [f"research/hypotheses/{day.isoformat()}/hypothesis.md"],
            "status": "untested",
            "linkedExperimentIds": [f"EXP-{day.strftime('%Y%m%d')}-01"],
            "linkedSubmissions": [],
            "confidence": "low",
            "caveats": "Parsed from free-form hypothesis markdown; scores may still be pending.",
        }
    ]


def load_strategy_excerpt(day: date) -> str | None:
    path = STRATEGIES / day.isoformat() / "next-submission-plan.md"
    if not path.exists():
        return None
    for line in path.read_text(encoding="utf-8").splitlines():
        s = line.strip()
        if s and not s.startswith("#") and len(s) > 20:
            return s[:400]
    return None


def load_analysis_facts(day: date) -> list[str]:
    facts: list[str] = []
    day_dir = ANALYSIS / day.isoformat()
    if not day_dir.exists():
        return facts
    for name in ("failure-analysis.md", "success-analysis.md", "causal-analysis.md"):
        p = day_dir / name
        if not p.exists():
            continue
        for line in p.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if s.startswith("- ") and len(s) > 8:
                facts.append(f"{name}: {s[2:][:220]}")
                if len(facts) >= 8:
                    return facts
    return facts


def compute_score_summary(
    submissions: list[Submission],
    prior_scores: list[float],
    prior_best: float | None,
    previous_close: float | None,
) -> dict[str, Any]:
    scored = [s.public_score for s in submissions if s.public_score is not None]
    first = scored[0] if scored else None
    last = scored[-1] if scored else None
    best = max(scored) if scored else None
    worst = min(scored) if scored else None
    daily_abs = (last - first) if first is not None and last is not None else None
    daily_pct = (
        (daily_abs / abs(first) * 100.0)
        if daily_abs is not None and first not in (None, 0)
        else None
    )
    change_prev_sub = None
    if scored and prior_scores:
        change_prev_sub = scored[0] - prior_scores[-1]
    elif len(scored) >= 2:
        change_prev_sub = scored[-1] - scored[-2]
    change_prev_close = (
        (last - previous_close) if last is not None and previous_close is not None else None
    )
    change_prior_best = (best - prior_best) if best is not None and prior_best is not None else (
        best if best is not None and prior_best is None else None
    )
    new_best = bool(
        best is not None and (prior_best is None or best > prior_best)
    )
    mean = statistics.mean(scored) if scored else None
    median = statistics.median(scored) if scored else None
    stdev = statistics.stdev(scored) if len(scored) >= 2 else None
    pending = sum(
        1
        for s in submissions
        if s.public_score is None
        or str(s.status).upper() in {"PENDING", "ERROR", "FAILED", "KAGGLE ERROR"}
    )
    cum = best
    if prior_best is not None and best is not None:
        cum = max(prior_best, best)
    elif prior_best is not None:
        cum = prior_best
    return {
        "firstScored": first,
        "lastScored": last,
        "bestScore": best,
        "worstScore": worst,
        "dailyAbsoluteChange": daily_abs,
        "dailyPercentageChange": daily_pct,
        "changeFromPreviousSubmission": change_prev_sub,
        "changeFromPreviousClose": change_prev_close,
        "changeFromPriorBest": change_prior_best,
        "newAllTimeBest": new_best,
        "submissionCount": len(submissions),
        "scoredCount": len(scored),
        "failedOrPendingCount": pending,
        "meanScore": mean,
        "medianScore": median,
        "scoreStdDev": stdev,
        "cumulativeBest": cum,
        "consecutiveImprovementCount": None,
        "daysSincePreviousAllTimeBest": None,
    }


def reason_for_score_move(summary: dict[str, Any], submissions: list[Submission]) -> str:
    concepts = [s.description for s in submissions if s.description]
    concept_txt = concepts[-1][:160] if concepts else "Not recorded"
    if summary["scoredCount"] == 0:
        return (
            f"No public score recorded yet for this day. "
            f"Submission concepts/description: {concept_txt}"
        )
    delta = summary.get("dailyAbsoluteChange")
    if delta is None:
        return f"Score recorded. Concepts: {concept_txt}"
    if delta > 0:
        return (
            f"Public score rose by {delta:.4f} "
            f"({summary['firstScored']:.4f} → {summary['lastScored']:.4f}). "
            f"Later submission followed: {concept_txt}"
        )
    if delta < 0:
        return (
            f"Public score fell by {abs(delta):.4f} "
            f"({summary['firstScored']:.4f} → {summary['lastScored']:.4f}). "
            f"Later submission followed: {concept_txt}"
        )
    return (
        f"Public score unchanged at {summary['lastScored']:.4f}. Concepts: {concept_txt}"
    )


def load_score_history() -> dict[str, Any]:
    if not SCORE_PATH.exists():
        return {
            "schemaVersion": 1,
            "project": PROJECT,
            "competition": COMPETITION,
            "timezone": "America/Chicago",
            "points": [],
            "bestPublicScore": None,
            "bestScoreDate": None,
            "latestPublicScore": None,
            "latestScoreDate": None,
            "totalSubmissions": 0,
            "experimentDays": 0,
        }
    return json.loads(SCORE_PATH.read_text(encoding="utf-8"))


def rebuild_score_history(all_subs: list[Submission]) -> dict[str, Any]:
    points = []
    best: float | None = None
    best_date: str | None = None
    for s in sorted(all_subs, key=lambda x: x.timestamp):
        if s.public_score is None:
            continue
        is_best = best is None or s.public_score > best
        if is_best:
            best = s.public_score
            best_date = s.timestamp.astimezone(TZ).date().isoformat()
        points.append(
            {
                "date": s.timestamp.astimezone(TZ).date().isoformat(),
                "timestamp": s.timestamp.astimezone(timezone.utc)
                .isoformat()
                .replace("+00:00", "Z"),
                "submissionRef": s.ref,
                "score": s.public_score,
                "status": s.status,
                "description": s.description,
                "cumulativeBest": best,
                "isAllTimeBest": is_best,
            }
        )
    days = {p["date"] for p in points}
    latest = points[-1] if points else None
    return {
        "schemaVersion": 1,
        "project": PROJECT,
        "competition": COMPETITION,
        "timezone": "America/Chicago",
        "updatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "points": points,
        "bestPublicScore": best,
        "bestScoreDate": best_date,
        "latestPublicScore": latest["score"] if latest else None,
        "latestScoreDate": latest["date"] if latest else None,
        "totalSubmissions": len(points),
        "experimentDays": len(days),
    }


def generate_day(day: date, *, dry_run: bool, force: bool) -> dict[str, Any]:
    warnings: list[str] = []
    day_subs = load_submission_for_day(day)
    if not day_subs:
        warnings.append(f"No submission.json for {day.isoformat()}")
    concepts = concepts_from_description(day_subs[0].description) if day_subs else []
    hypotheses = load_hypotheses(day)
    strategy_excerpt = load_strategy_excerpt(day)
    if strategy_excerpt and day_subs and not day_subs[0].strategy:
        day_subs[0].strategy = strategy_excerpt[:80]
    for h in hypotheses:
        if day_subs:
            h["linkedSubmissions"] = [day_subs[0].ref]
            if day_subs[0].public_score is not None:
                h["observedResult"] = f"Public score {day_subs[0].public_score}"

    hist = load_score_history()
    prior_points = [
        p
        for p in hist.get("points") or []
        if p.get("date") and p["date"] < day.isoformat() and p.get("score") is not None
    ]
    prior_scores = [float(p["score"]) for p in prior_points]
    prior_best = max(prior_scores) if prior_scores else None
    previous_close = prior_scores[-1] if prior_scores else None

    summary = compute_score_summary(day_subs, prior_scores, prior_best, previous_close)
    start, end = day_window(day)
    move_reason = reason_for_score_move(summary, day_subs)
    analysis_facts = load_analysis_facts(day)

    daily_summary = (
        f"{summary['submissionCount']} submission(s); {summary['scoredCount']} scored. "
        f"Best {summary['bestScore'] if summary['bestScore'] is not None else 'Not recorded'}. "
        f"{move_reason}"
    )

    record: dict[str, Any] = {
        "schemaVersion": 1,
        "project": PROJECT,
        "competition": COMPETITION,
        "date": day.isoformat(),
        "timezone": "America/Chicago",
        "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "sourceWindow": {
            "start": start.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
            "end": end.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
        },
        "dailySummary": daily_summary,
        "submissions": [s.to_dict() for s in day_subs],
        "scoreSummary": summary,
        "scoreMovementReason": move_reason,
        "conceptsImplemented": concepts,
        "research": [],
        "hypotheses": hypotheses,
        "experiments": [
            {
                "id": f"EXP-{day.strftime('%Y%m%d')}-{i+1:02d}",
                "strategy": s.strategy or "Not recorded",
                "configSummary": s.description or "Not recorded",
                "submissionRefs": [s.ref],
            }
            for i, s in enumerate(day_subs)
        ],
        "results": {
            "facts": analysis_facts
            or [
                f"Scored submissions: {summary['scoredCount']}",
                f"Best score today: {summary['bestScore']}",
                move_reason,
            ],
            "whatWorked": (
                ["Score improved vs first scored submission of the day."]
                if (summary.get("dailyAbsoluteChange") or 0) > 0
                else ["Not recorded"]
            ),
            "whatDidNotWork": (
                ["Score decreased vs first scored submission of the day."]
                if (summary.get("dailyAbsoluteChange") or 0) < 0
                else ["Not recorded"]
            ),
        },
        "analysis": {
            "facts": analysis_facts or [move_reason],
            "interpretations": [
                "Interpretations are limited to recorded artifacts; "
                "pending Kaggle scores are marked Not recorded."
            ],
            "limitations": warnings or ["None recorded"],
            "nextSteps": [strategy_excerpt]
            if strategy_excerpt
            else ["Not recorded — see strategies/ for next-day plan."],
        },
        "githubActivity": {
            "commits": [],
            "changedFiles": [],
            "note": "See arc-agi-3-research/research/{submissions,analysis,hypotheses,strategies}/"
            f"{day.isoformat()}",
        },
        "provenance": [
            {
                "claim": "submissions",
                "source": f"research/submissions/{day.isoformat()}/submission.json",
            },
            {
                "claim": "concepts",
                "source": "Parsed from submission description tokens",
            },
            {
                "claim": "hypotheses",
                "source": f"research/hypotheses/{day.isoformat()}/hypothesis.md",
            },
        ],
        "warnings": warnings,
    }

    # Rebuild score history from all submission folders (+ keep prior points without files)
    all_subs: list[Submission] = []
    if SUBMISSIONS.exists():
        for folder in sorted(SUBMISSIONS.iterdir()):
            if not folder.is_dir():
                continue
            try:
                d = date.fromisoformat(folder.name)
            except ValueError:
                continue
            all_subs.extend(load_submission_for_day(d))
    # Merge status-summary history as fallback scored points
    status_path = RESEARCH / "status-summary.json"
    if status_path.exists():
        try:
            status = json.loads(status_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            status = {}
        existing_refs = {s.ref for s in all_subs}
        for row in status.get("submission_history") or []:
            score = parse_score(row.get("score"))
            if score is None:
                continue
            ref = str(row.get("name") or row.get("date") or "")
            if ref in existing_refs:
                continue
            d = date.fromisoformat(str(row.get("date")))
            all_subs.append(
                Submission(
                    ref=ref,
                    timestamp=datetime(d.year, d.month, d.day, 12, 0, tzinfo=TZ),
                    file_name="submission.parquet",
                    description=str(row.get("note") or row.get("name") or ""),
                    status=str(row.get("status") or "COMPLETE"),
                    public_score=score,
                    private_score=None,
                )
            )

    new_hist = rebuild_score_history(all_subs)

    if dry_run:
        print(json.dumps({"day": record["date"], "summary": summary, "warnings": warnings}, indent=2))
        return record

    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    out_path = DAILY_DIR / f"{day.isoformat()}.json"
    _ = force  # same path overwrite is idempotent
    out_path.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    SCORE_PATH.write_text(json.dumps(new_hist, indent=2) + "\n", encoding="utf-8")

    if CONFIG_PATH.exists() and summary.get("newAllTimeBest") and summary.get("bestScore") is not None:
        try:
            cfg = json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
            cfg["currentBestApproach"] = (
                f"Best public score {summary['bestScore']} on {day.isoformat()}. "
                + (day_subs[-1].description if day_subs else "")
            )
            CONFIG_PATH.write_text(json.dumps(cfg, indent=2) + "\n", encoding="utf-8")
        except json.JSONDecodeError:
            pass

    print(f"Wrote {out_path}")
    return record


def list_submission_dates() -> list[date]:
    if not SUBMISSIONS.exists():
        return []
    out: list[date] = []
    for folder in sorted(SUBMISSIONS.iterdir()):
        if folder.is_dir() and (folder / "submission.json").exists():
            try:
                out.append(date.fromisoformat(folder.name))
            except ValueError:
                continue
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="ARC-AGI-3 project-page-agent")
    ap.add_argument(
        "command",
        choices=["generate", "backfill", "validate", "dry-run", "backfill-all"],
    )
    ap.add_argument("--date", help="YYYY-MM-DD (America/Chicago calendar day)")
    ap.add_argument("--from", dest="date_from", help="Backfill start YYYY-MM-DD")
    ap.add_argument("--to", dest="date_to", help="Backfill end YYYY-MM-DD")
    ap.add_argument(
        "--require-eleven-pm",
        action="store_true",
        help="Exit 0 without writing unless local America/Chicago hour is 23",
    )
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    if args.require_eleven_pm and not is_eleven_pm_chicago():
        print(
            f"Skip: Chicago hour is {now_chicago().hour}, not 23.",
            file=sys.stderr,
        )
        sys.exit(0)

    if args.command == "validate":
        ok = True
        for p in sorted(DAILY_DIR.glob("*.json")):
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
                assert data.get("schemaVersion") == 1
                assert data.get("date")
                assert "scoreSummary" in data
            except Exception as exc:  # noqa: BLE001
                print(f"INVALID {p}: {exc}")
                ok = False
        if SCORE_PATH.exists():
            json.loads(SCORE_PATH.read_text(encoding="utf-8"))
        print("validate ok" if ok else "validate failed")
        sys.exit(0 if ok else 1)

    if args.command == "backfill-all":
        dates = list_submission_dates()
        for d in dates:
            generate_day(d, dry_run=False, force=True)
        print(f"backfilled {len(dates)} days")
        return

    if args.command == "backfill":
        if not args.date_from or not args.date_to:
            ap.error("backfill requires --from and --to")
        start = date.fromisoformat(args.date_from)
        end = date.fromisoformat(args.date_to)
        d = start
        while d <= end:
            generate_day(d, dry_run=False, force=True)
            d += timedelta(days=1)
        return

    day = date.fromisoformat(args.date) if args.date else chicago_day()
    dry = args.command == "dry-run"
    generate_day(day, dry_run=dry, force=args.force)


if __name__ == "__main__":
    main()
