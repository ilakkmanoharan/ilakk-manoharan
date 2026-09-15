#!/usr/bin/env python3
"""RSNA Knee project-page-agent.

Deterministic daily collector for the portfolio research log:
- Kaggle submissions (optional; requires credentials)
- Git commits from the RSNA repo (optional local clone)
- Existing Agent1 Research/Analysis/Hypothesis artifacts
- Score statistics + score-history.json + daily/YYYY-MM-DD.json

Timezone: America/Chicago. Designed to run at 11 PM Central via GHA.
"""

from __future__ import annotations

import argparse
import json
import math
import os
import re
import statistics
import subprocess
import sys
from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from typing import Any
from zoneinfo import ZoneInfo

TZ = ZoneInfo("America/Chicago")
COMPETITION = "rsna-knee-abnormality-detection"
PROJECT = "rsna-knee-mri-classifier"

ROOT = Path(__file__).resolve().parent
RESEARCH = ROOT / "research"
DAILY_DIR = RESEARCH / "daily"
SCORE_PATH = RESEARCH / "score-history.json"
CONFIG_PATH = RESEARCH / "config.json"


def now_chicago() -> datetime:
    return datetime.now(TZ)


def chicago_day(d: date | None = None) -> date:
    if d is not None:
        return d
    return now_chicago().date()


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
        if dt is None:
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(TZ)


def is_eleven_pm_chicago(now: datetime | None = None) -> bool:
    n = now or now_chicago()
    return n.hour == 23


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
            "timestamp": self.timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
            "fileName": self.file_name,
            "description": self.description,
            "status": self.status,
            "publicScore": self.public_score,
            "privateScore": self.private_score,
            "strategy": self.strategy,
        }


def fetch_kaggle_submissions() -> list[Submission]:
    """Use kaggle CLI when credentials exist; otherwise return []."""
    if not (os.environ.get("KAGGLE_API_TOKEN") or os.environ.get("KAGGLE_KEY")):
        return []
    try:
        import tempfile
        from kaggle.api.kaggle_api_extended import KaggleApi

        api = KaggleApi()
        api.authenticate()
        # list competition submissions for this user
        with tempfile.TemporaryDirectory() as tmp:
            # Prefer CLI for stable JSON-ish output via python API list
            result = api.competition_submissions(COMPETITION)
        out: list[Submission] = []
        for row in result or []:
            # row may be object or dict
            get = (lambda k, default=None: getattr(row, k, row.get(k, default) if isinstance(row, dict) else default))
            ref = str(get("ref") or get("submissionId") or get("id") or "")
            date_s = str(get("date") or get("submittedBy") or get("dateSubmitted") or "")
            # Kaggle API CompetitionSubmission has .date as datetime sometimes
            if hasattr(row, "date") and not isinstance(row.date, str):
                ts = row.date
                if ts.tzinfo is None:
                    ts = ts.replace(tzinfo=timezone.utc)
                ts = ts.astimezone(TZ)
            else:
                ts = parse_ts(date_s)
            if not ts or not ref:
                continue
            score_raw = get("publicScore") or get("public_score")
            try:
                score = float(score_raw) if score_raw not in (None, "", "None") else None
            except (TypeError, ValueError):
                score = None
            desc = str(get("description") or "")
            strategy = None
            m = re.search(r"strategy=([a-zA-Z0-9_\-]+)", desc)
            if m:
                strategy = m.group(1)
            out.append(
                Submission(
                    ref=ref,
                    timestamp=ts,
                    file_name=str(get("fileName") or get("file_name") or "submission.csv"),
                    description=desc,
                    status=str(get("status") or get("submissionStatus") or "UNKNOWN"),
                    public_score=score,
                    private_score=None,
                    strategy=strategy,
                )
            )
        return out
    except Exception as exc:  # noqa: BLE001 — never wipe history on Kaggle failure
        print(f"WARN: Kaggle fetch failed: {exc}", file=sys.stderr)
        return []


def load_submissions_from_rsna_repo(rsna_root: Path, day: date) -> list[Submission]:
    analysis = rsna_root / "Analysis"
    if not analysis.exists():
        return []
    pattern = f"{day.isoformat()}_*_submissions.json"
    files = sorted(analysis.glob(pattern))
    if not files:
        return []
    # use newest cycle file
    path = files[-1]
    try:
        rows = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    out: list[Submission] = []
    for row in rows:
        ts = parse_ts(str(row.get("date") or ""))
        if not ts or ts.date() != day:
            # still include if date string is same calendar day in Chicago after parse
            if ts and ts.astimezone(TZ).date() != day:
                continue
            if not ts:
                continue
        score_raw = row.get("publicScore")
        try:
            score = float(score_raw) if score_raw is not None else None
        except (TypeError, ValueError):
            score = None
        desc = str(row.get("description") or "")
        strategy = None
        m = re.search(r"strategy=([a-zA-Z0-9_\-]+)", desc)
        if m:
            strategy = m.group(1)
        out.append(
            Submission(
                ref=str(row.get("ref") or ""),
                timestamp=ts.astimezone(TZ),
                file_name=str(row.get("fileName") or "submission.csv"),
                description=desc,
                status=str(row.get("status") or "UNKNOWN").replace("SubmissionStatus.", ""),
                public_score=score,
                private_score=row.get("privateScore"),
                strategy=strategy,
            )
        )
    # dedupe by ref
    seen: set[str] = set()
    uniq: list[Submission] = []
    for s in sorted(out, key=lambda x: x.timestamp):
        if s.ref in seen:
            continue
        seen.add(s.ref)
        uniq.append(s)
    return uniq


def load_concepts_from_research(rsna_root: Path, day: date) -> list[dict[str, str]]:
    research = rsna_root / "Research"
    files = sorted(research.glob(f"{day.isoformat()}_*_research.json"))
    if not files:
        return []
    try:
        data = json.loads(files[-1].read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return []
    concepts = []
    for t in data.get("techniques") or []:
        concepts.append(
            {
                "name": t.get("name") or "Untitled",
                "why": t.get("why") or "Not recorded",
                "how": t.get("how") or "Not recorded",
            }
        )
    return concepts


def load_hypotheses_from_md(rsna_root: Path, day: date) -> list[dict[str, Any]]:
    hyp_dir = rsna_root / "Hypothesis analysis"
    files = sorted(hyp_dir.glob(f"{day.isoformat()}_*_hypotheses.md"))
    if not files:
        return []
    text = files[-1].read_text(encoding="utf-8")
    hyps: list[dict[str, Any]] = []
    # Primary block
    m = re.search(
        r"\*\*ID:\*\*\s*`([^`]+)`\s*\n-\s*\*\*Hypothesis:\*\*\s*(.+)",
        text,
    )
    if m:
        hyps.append(
            {
                "id": m.group(1).strip(),
                "statement": m.group(2).strip(),
                "motivation": "Not recorded",
                "changeBeingTested": "Primary hypothesis this cycle",
                "expectedResult": "Not recorded",
                "observedResult": "Not recorded",
                "evidence": [],
                "status": "untested",
                "linkedExperimentIds": [],
                "linkedSubmissions": [],
                "confidence": "low",
                "caveats": "Parsed from hypothesis markdown; status not asserted without score linkage.",
            }
        )
    for line in text.splitlines():
        if line.strip().startswith("- `H_"):
            mm = re.match(r"- `(H_[a-zA-Z0-9_]+)`\s*:?\s*(?:← primary:)?\s*(.*)", line.strip())
            if not mm:
                continue
            hid, stmt = mm.group(1), mm.group(2).strip()
            if any(h["id"] == hid for h in hyps):
                continue
            hyps.append(
                {
                    "id": hid,
                    "statement": stmt or "Not recorded",
                    "motivation": "Not recorded",
                    "changeBeingTested": "Backlog",
                    "expectedResult": "Not recorded",
                    "observedResult": "Not recorded",
                    "evidence": [],
                    "status": "untested",
                    "linkedExperimentIds": [],
                    "linkedSubmissions": [],
                    "confidence": "low",
                    "caveats": "Backlog item from hypothesis analysis.",
                }
            )
    return hyps


def git_activity(rsna_root: Path, day: date) -> dict[str, Any]:
    if not (rsna_root / ".git").exists():
        return {"commits": [], "changedFiles": [], "note": "Not recorded — RSNA repo path missing .git"}
    start, end = day_window(day)
    since = start.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    until = (end + timedelta(seconds=1)).astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    try:
        log = subprocess.check_output(
            [
                "git",
                "-C",
                str(rsna_root),
                "log",
                f"--since={since}",
                f"--until={until}",
                "--pretty=format:%H|%cI|%s",
            ],
            text=True,
        )
    except subprocess.CalledProcessError:
        return {"commits": [], "changedFiles": [], "note": "Not recorded — git log failed"}
    commits = []
    for line in log.splitlines():
        if not line.strip():
            continue
        parts = line.split("|", 2)
        if len(parts) < 3:
            continue
        commits.append({"sha": parts[0], "timestamp": parts[1], "message": parts[2]})
    files: list[str] = []
    if commits:
        try:
            names = subprocess.check_output(
                [
                    "git",
                    "-C",
                    str(rsna_root),
                    "log",
                    f"--since={since}",
                    f"--until={until}",
                    "--name-only",
                    "--pretty=format:",
                ],
                text=True,
            )
            files = sorted({n for n in names.splitlines() if n.strip()})
        except subprocess.CalledProcessError:
            files = []
    return {"commits": commits, "changedFiles": files, "note": None}


def compute_score_summary(
    day_subs: list[Submission],
    prior_scored: list[float],
    prior_best: float | None,
    previous_close: float | None,
) -> dict[str, Any]:
    scored = [s for s in day_subs if s.public_score is not None]
    scores = [float(s.public_score) for s in scored if s.public_score is not None]
    first = scores[0] if scores else None
    last = scores[-1] if scores else None
    best = max(scores) if scores else None
    worst = min(scores) if scores else None
    daily_abs = (last - first) if first is not None and last is not None else None
    daily_pct = (
        (daily_abs / abs(first) * 100.0)
        if daily_abs is not None and first not in (None, 0)
        else None
    )
    prev_sub = prior_scored[-1] if prior_scored else None
    change_prev_sub = (last - prev_sub) if last is not None and prev_sub is not None else None
    change_prev_close = (
        (last - previous_close) if last is not None and previous_close is not None else None
    )
    change_prior_best = (
        (best - prior_best) if best is not None and prior_best is not None else (best if best is not None else None)
    )
    new_best = bool(best is not None and (prior_best is None or best > prior_best))
    std = statistics.pstdev(scores) if len(scores) >= 2 else None
    median = statistics.median(scores) if scores else None
    mean = statistics.mean(scores) if scores else None
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
        "submissionCount": len(day_subs),
        "scoredCount": len(scores),
        "failedOrPendingCount": len(day_subs) - len(scores),
        "meanScore": mean,
        "medianScore": median,
        "scoreStdDev": std,
        "cumulativeBest": max([*(prior_scored or []), *scores]) if (prior_scored or scores) else None,
        "consecutiveImprovementCount": None,
        "daysSincePreviousAllTimeBest": None,
    }


def load_score_history() -> dict[str, Any]:
    if SCORE_PATH.exists():
        try:
            return json.loads(SCORE_PATH.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
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


def rebuild_score_history(all_subs: list[Submission]) -> dict[str, Any]:
    points = []
    best = None
    best_date = None
    for s in sorted(all_subs, key=lambda x: x.timestamp):
        if s.public_score is None:
            continue
        score = float(s.public_score)
        is_best = best is None or score > best
        if is_best:
            best = score
            best_date = s.timestamp.date().isoformat()
        points.append(
            {
                "date": s.timestamp.date().isoformat(),
                "timestamp": s.timestamp.astimezone(timezone.utc).isoformat().replace("+00:00", "Z"),
                "submissionRef": s.ref,
                "score": score,
                "status": s.status,
                "description": s.description,
                "cumulativeBest": best,
                "isAllTimeBest": is_best,
            }
        )
    days = sorted({p["date"] for p in points})
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


def reason_for_score_move(summary: dict[str, Any], day_subs: list[Submission]) -> str:
    if summary["scoredCount"] == 0:
        return "No scored submissions today — score movement Not recorded."
    delta = summary.get("dailyAbsoluteChange")
    if delta is None:
        return "Not recorded."
    strategies = [s.strategy for s in day_subs if s.strategy]
    strat_txt = ", ".join(strategies) if strategies else "recorded strategies"
    if delta > 0:
        return (
            f"Public score rose by {delta:.4f} from first to last scored submission "
            f"({summary['firstScored']:.4f} → {summary['lastScored']:.4f}). "
            f"The later submissions followed {strat_txt}. "
            "Do not claim causation beyond explicit strategy linkage."
        )
    if delta < 0:
        return (
            f"Public score fell by {abs(delta):.4f} from first to last scored submission "
            f"({summary['firstScored']:.4f} → {summary['lastScored']:.4f}). "
            f"Later submissions followed {strat_txt}."
        )
    return (
        f"Public score unchanged from first to last scored ({summary['lastScored']:.4f}). "
        f"Strategies seen: {strat_txt}."
    )


def generate_day(
    day: date,
    rsna_root: Path | None,
    *,
    dry_run: bool,
    force: bool,
) -> dict[str, Any]:
    warnings: list[str] = []
    kaggle_subs = fetch_kaggle_submissions()
    artifact_subs: list[Submission] = []
    concepts: list[dict[str, str]] = []
    hypotheses: list[dict[str, Any]] = []
    gh: dict[str, Any] = {"commits": [], "changedFiles": [], "note": "Not recorded"}

    if rsna_root and rsna_root.exists():
        artifact_subs = load_submissions_from_rsna_repo(rsna_root, day)
        concepts = load_concepts_from_research(rsna_root, day)
        hypotheses = load_hypotheses_from_md(rsna_root, day)
        gh = git_activity(rsna_root, day)
    else:
        warnings.append("RSNA repo path not provided or missing — using Kaggle-only / existing history.")

    # Prefer Kaggle for the day when available; else artifacts
    day_subs = [s for s in kaggle_subs if s.timestamp.astimezone(TZ).date() == day]
    if not day_subs:
        day_subs = artifact_subs
        if not kaggle_subs:
            warnings.append("Kaggle credentials missing or fetch empty — used repo Analysis JSON if present.")
    else:
        # merge strategy hints from artifacts by ref
        by_ref = {s.ref: s for s in artifact_subs}
        for s in day_subs:
            if not s.strategy and s.ref in by_ref:
                s.strategy = by_ref[s.ref].strategy

    hist = load_score_history()
    prior_points = [
        p
        for p in hist.get("points") or []
        if p.get("date") and p["date"] < day.isoformat() and p.get("score") is not None
    ]
    prior_scores = [float(p["score"]) for p in prior_points]
    prior_best = max(prior_scores) if prior_scores else None
    previous_close = prior_scores[-1] if prior_scores else None

    # Link hypothesis observed results when possible
    scored = [s for s in day_subs if s.public_score is not None]
    for h in hypotheses:
        for s in scored:
            if s.strategy and s.strategy.replace("-", "_") in h["id"].replace("-", "_"):
                h["observedResult"] = f"Public score {s.public_score}"
                h["linkedSubmissions"] = [s.ref]
                h["evidence"] = [f"submission {s.ref} publicScore {s.public_score}"]
                if prior_best is None or (s.public_score is not None and s.public_score > (prior_best or -math.inf)):
                    h["status"] = "partially_supported"
                break
            desc = (s.description or "").lower()
            token = h["id"].replace("H_", "").replace("_", "")
            if token and token in desc.replace("_", "").replace("-", ""):
                h["linkedSubmissions"] = list({*(h.get("linkedSubmissions") or []), s.ref})

    summary = compute_score_summary(day_subs, prior_scores, prior_best, previous_close)
    start, end = day_window(day)
    move_reason = reason_for_score_move(summary, day_subs)

    daily_summary = (
        f"{summary['submissionCount']} submission(s); {summary['scoredCount']} scored. "
        f"Best {summary['bestScore'] if summary['bestScore'] is not None else 'Not recorded'}. "
        f"{move_reason}"
    )

    record = {
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
        "submissions": [s.to_dict() for s in sorted(day_subs, key=lambda x: x.timestamp)],
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
            "facts": [
                f"Scored submissions: {summary['scoredCount']}",
                f"Best score today: {summary['bestScore']}",
                move_reason,
            ],
            "whatWorked": (
                ["Score improved vs first submission of the day."]
                if (summary.get("dailyAbsoluteChange") or 0) > 0
                else ["Not recorded"]
            ),
            "whatDidNotWork": (
                ["Score decreased vs first submission of the day."]
                if (summary.get("dailyAbsoluteChange") or 0) < 0
                else ["Not recorded"]
            ),
        },
        "analysis": {
            "facts": [
                move_reason,
            ],
            "interpretations": [
                "Interpretations are limited to recorded strategies and artifacts; "
                "commits are associated temporally unless explicitly linked."
            ],
            "limitations": warnings or ["None recorded"],
            "nextSteps": ["Not recorded — fill research notes template for stronger next-day plans."],
        },
        "githubActivity": gh,
        "provenance": [
            {"claim": "submissions", "source": "Kaggle API and/or RSNA Analysis/*_submissions.json"},
            {"claim": "concepts", "source": "RSNA Research/*_research.json"},
            {"claim": "hypotheses", "source": "RSNA Hypothesis analysis/*_hypotheses.md"},
        ],
        "warnings": warnings,
    }

    # Merge into score history: keep other days' points, replace this day's
    existing = load_score_history()
    other_points_subs: list[Submission] = []
    for p in existing.get("points") or []:
        if p.get("date") == day.isoformat():
            continue
        ts = parse_ts(str(p.get("timestamp") or "")) or datetime.now(TZ)
        other_points_subs.append(
            Submission(
                ref=str(p.get("submissionRef") or ""),
                timestamp=ts,
                file_name="submission.csv",
                description=str(p.get("description") or ""),
                status=str(p.get("status") or "COMPLETE"),
                public_score=float(p["score"]) if p.get("score") is not None else None,
                private_score=None,
            )
        )
    all_for_hist = other_points_subs + [s for s in day_subs if s.public_score is not None]
    # Also keep kaggle historical if we fetched them
    if kaggle_subs:
        by_ref = {s.ref: s for s in all_for_hist}
        for s in kaggle_subs:
            if s.public_score is None:
                continue
            by_ref[s.ref] = s
        all_for_hist = list(by_ref.values())

    new_hist = rebuild_score_history(all_for_hist)

    if dry_run:
        print(json.dumps({"day": record["date"], "summary": summary, "warnings": warnings}, indent=2))
        return record

    DAILY_DIR.mkdir(parents=True, exist_ok=True)
    out_path = DAILY_DIR / f"{day.isoformat()}.json"
    if out_path.exists() and not force:
        # idempotent update always overwrites same path
        pass
    out_path.write_text(json.dumps(record, indent=2) + "\n", encoding="utf-8")
    SCORE_PATH.write_text(json.dumps(new_hist, indent=2) + "\n", encoding="utf-8")

    # Update config best approach hint if improved
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
    print(f"Wrote {SCORE_PATH}")
    return record


def main() -> None:
    ap = argparse.ArgumentParser(description="RSNA Knee project-page-agent")
    ap.add_argument("command", choices=["generate", "backfill", "validate", "dry-run"])
    ap.add_argument("--date", help="YYYY-MM-DD (America/Chicago calendar day)")
    ap.add_argument("--from", dest="date_from", help="Backfill start YYYY-MM-DD")
    ap.add_argument("--to", dest="date_to", help="Backfill end YYYY-MM-DD")
    ap.add_argument(
        "--rsna-repo",
        default=os.environ.get(
            "RSNA_REPO_PATH",
            str(Path.home() / "Projects" / "rsna-knee-mri-classifier"),
        ),
        help="Path to cloned rsna-knee-mri-classifier repo",
    )
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

    rsna_root = Path(args.rsna_repo) if args.rsna_repo else None

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

    if args.command == "backfill":
        if not args.date_from or not args.date_to:
            ap.error("backfill requires --from and --to")
        start = date.fromisoformat(args.date_from)
        end = date.fromisoformat(args.date_to)
        d = start
        while d <= end:
            generate_day(d, rsna_root, dry_run=False, force=True)
            d += timedelta(days=1)
        return

    day = date.fromisoformat(args.date) if args.date else chicago_day()
    dry = args.command == "dry-run"
    generate_day(day, rsna_root, dry_run=dry, force=args.force)


if __name__ == "__main__":
    main()
