from __future__ import annotations

import json
import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

from agent.config import AgentConfig
from agent.kaggle_auth import setup_kaggle_credentials

COMPETITION_URL = "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3"
SUBMISSIONS_URL = (
    "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3/submissions"
)


@dataclass
class SubmissionRecord:
    submission_id: str
    status: str
    score: float | None
    private_score: float | None
    description: str
    error_description: str | None
    file_name: str | None
    kernel_slug: str | None
    kernel_version: str | None
    notebook_url: str | None
    url: str
    submitted_at: str | None
    raw: dict[str, Any]


def _attr(obj: Any, name: str, default: Any = None) -> Any:
    if isinstance(obj, dict):
        return obj.get(name, default)
    return getattr(obj, name, default)


def _parse_score(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _normalize_status(value: Any) -> str:
    text = str(value or "unknown")
    if "." in text:
        text = text.split(".")[-1]
    return text.upper()


def parse_kernel_ref(notebook_url: str | None) -> tuple[str | None, str | None]:
    """Extract owner/slug and scriptVersionId from a Kaggle notebook URL."""
    if not notebook_url:
        return None, None

    path = notebook_url
    if notebook_url.startswith("http"):
        path = urlparse(notebook_url).path

    match = re.search(r"/code/([^/]+)/([^/?]+)", path)
    if not match:
        return None, None

    kernel_slug = f"{match.group(1)}/{match.group(2)}"
    query = parse_qs(urlparse(notebook_url).query if notebook_url.startswith("http") else "")
    version = None
    if "scriptVersionId" in query and query["scriptVersionId"]:
        version = query["scriptVersionId"][0]
    return kernel_slug, version


class KaggleClient:
    def __init__(self, config: AgentConfig) -> None:
        self.config = config
        self._api = None

    def _get_api(self):
        if self._api is not None:
            return self._api
        if not self.config.has_kaggle():
            raise RuntimeError(
                "Kaggle credentials missing. Set KAGGLE_API_TOKEN or "
                "KAGGLE_USERNAME + KAGGLE_KEY, or run with ARC_AGENT_DRY_RUN=1."
            )
        setup_kaggle_credentials()
        from kaggle.api.kaggle_api_extended import KaggleApi

        api = KaggleApi()
        api.authenticate()
        self._api = api
        return api

    def _normalize_submission(self, row: Any) -> SubmissionRecord:
        notebook_path = _attr(row, "url")
        notebook_url = (
            f"https://www.kaggle.com{notebook_path}"
            if notebook_path and str(notebook_path).startswith("/")
            else notebook_path
        )
        kernel_slug, kernel_version = parse_kernel_ref(
            str(notebook_url) if notebook_url else None
        )
        submission_id = str(_attr(row, "ref") or _attr(row, "fileName") or "")
        return SubmissionRecord(
            submission_id=submission_id,
            status=_normalize_status(_attr(row, "status")),
            score=_parse_score(_attr(row, "publicScore")),
            private_score=_parse_score(_attr(row, "privateScore")),
            description=str(_attr(row, "description") or ""),
            error_description=_attr(row, "errorDescription"),
            file_name=_attr(row, "fileName"),
            kernel_slug=kernel_slug,
            kernel_version=kernel_version,
            notebook_url=str(notebook_url) if notebook_url else None,
            url=SUBMISSIONS_URL,
            submitted_at=str(_attr(row, "date") or ""),
            raw={
                "ref": _attr(row, "ref"),
                "status": _normalize_status(_attr(row, "status")),
                "publicScore": _attr(row, "publicScore"),
                "privateScore": _attr(row, "privateScore"),
                "description": _attr(row, "description"),
                "errorDescription": _attr(row, "errorDescription"),
                "fileName": _attr(row, "fileName"),
                "url": notebook_path,
                "date": str(_attr(row, "date") or ""),
            },
        )

    def list_submissions(self) -> list[SubmissionRecord]:
        api = self._get_api()
        rows = api.competition_submissions(self.config.competition)
        return [self._normalize_submission(row) for row in rows or []]

    def latest_submission(self) -> SubmissionRecord | None:
        submissions = self.list_submissions()
        return submissions[0] if submissions else None

    def save_submission_snapshot(
        self, submission: SubmissionRecord, day_dir: Path
    ) -> Path:
        out = day_dir / "submission.json"
        payload = {
            "submission_id": submission.submission_id,
            "status": submission.status,
            "score": submission.score,
            "private_score": submission.private_score,
            "description": submission.description,
            "error_description": submission.error_description,
            "file_name": submission.file_name,
            "kernel_slug": submission.kernel_slug,
            "kernel_version": submission.kernel_version,
            "notebook_url": submission.notebook_url,
            "submitted_at": submission.submitted_at,
            "competition_url": COMPETITION_URL,
            "submissions_url": SUBMISSIONS_URL,
            "url": submission.url,
            "raw": submission.raw,
        }
        out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
        return out

    def download_submission_logs(
        self, submission: SubmissionRecord, logs_dir: Path
    ) -> list[Path]:
        """Download raw kernel output + log files for the latest submission."""
        logs_dir.mkdir(parents=True, exist_ok=True)
        saved: list[Path] = []

        meta = {
            "submission_id": submission.submission_id,
            "status": submission.status,
            "kernel_slug": submission.kernel_slug,
            "kernel_version": submission.kernel_version,
            "notebook_url": submission.notebook_url,
            "retrieved": True,
        }
        meta_path = logs_dir / "metadata.json"
        meta_path.write_text(json.dumps(meta, indent=2) + "\n", encoding="utf-8")
        saved.append(meta_path)

        snapshot = logs_dir / "submission-api.json"
        snapshot.write_text(
            json.dumps(submission.raw, indent=2) + "\n", encoding="utf-8"
        )
        saved.append(snapshot)

        if submission.error_description:
            error_path = logs_dir / "submission-error.txt"
            error_path.write_text(
                str(submission.error_description) + "\n", encoding="utf-8"
            )
            saved.append(error_path)

        if not submission.kernel_slug or self.config.dry_run:
            readme = logs_dir / "README.txt"
            readme.write_text(
                "No kernel slug on submission; logs not downloaded.\n",
                encoding="utf-8",
            )
            saved.append(readme)
            return saved

        api = self._get_api()
        kernel_out = logs_dir / "kernel-output"
        if kernel_out.exists():
            shutil.rmtree(kernel_out)
        kernel_out.mkdir(parents=True, exist_ok=True)

        api.kernels_output(submission.kernel_slug, str(kernel_out), force=True, quiet=True)

        for path in sorted(kernel_out.rglob("*")):
            if not path.is_file():
                continue
            target = logs_dir / path.name
            shutil.copy2(path, target)
            saved.append(target)

        status_response = api.kernels_status(submission.kernel_slug)
        status_path = logs_dir / "kernel-status.json"
        status_path.write_text(
            json.dumps(
                {
                    "status": str(getattr(status_response, "status", status_response)),
                    "failure_message": getattr(status_response, "failureMessage", None),
                },
                indent=2,
            )
            + "\n",
            encoding="utf-8",
        )
        saved.append(status_path)
        return saved

    def dry_run_submission(self) -> SubmissionRecord:
        return SubmissionRecord(
            submission_id="dry-run",
            status="COMPLETE",
            score=None,
            private_score=None,
            description="Dry-run placeholder submission",
            error_description=None,
            file_name="submission.parquet",
            kernel_slug="ilakkmanoharan/asra-phase-4-arc-prize-2026",
            kernel_version=None,
            notebook_url=(
                "https://www.kaggle.com/code/ilakkmanoharan/"
                "asra-phase-4-arc-prize-2026"
            ),
            url=SUBMISSIONS_URL,
            submitted_at=None,
            raw={"dry_run": True},
        )
