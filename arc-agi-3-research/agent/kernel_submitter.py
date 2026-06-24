from __future__ import annotations

import json
import shutil
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from agent.config import AgentConfig
from agent.kaggle_auth import setup_kaggle_credentials


@dataclass
class KernelPushResult:
    kernel_slug: str
    version: int | None
    url: str
    raw: dict[str, Any]


@dataclass
class CompetitionSubmitResult:
    submission_id: str | None
    kernel_slug: str
    kernel_version: int | None
    message: str
    url: str
    raw: Any


def default_kernel_slug(config: AgentConfig) -> str:
    username = config.kaggle_username or "ilakkmanoharan"
    slug = config.kaggle_kernel_slug or "arc-agi-3-research-agent"
    return f"{username}/{slug}"


def build_kernel_package(
    config: AgentConfig,
    notebook_path: Path,
    *,
    message: str,
    day: str,
) -> Path:
    """Stage notebook + kernel-metadata.json for kernels_push."""
    package_dir = config.research_root / "submissions" / day / "kernel-package"
    if package_dir.exists():
        shutil.rmtree(package_dir)
    package_dir.mkdir(parents=True, exist_ok=True)

    notebook_name = "arc_agi_3_next_submission.ipynb"
    target_notebook = package_dir / notebook_name
    shutil.copy2(notebook_path, target_notebook)

    owner, slug = default_kernel_slug(config).split("/", 1)
    metadata = {
        "id": f"{owner}/{slug}",
        "title": f"ARC-AGI-3 Research Agent — {day}",
        "code_file": notebook_name,
        "language": "python",
        "kernel_type": "notebook",
        "is_private": "true",
        "enable_gpu": "true",
        "enable_internet": "false",
        "competition_sources": [config.competition],
        "dataset_sources": [],
        "kernel_sources": [],
        "model_sources": [],
    }
    (package_dir / "kernel-metadata.json").write_text(
        json.dumps(metadata, indent=2) + "\n",
        encoding="utf-8",
    )
    (package_dir / "submission-message.txt").write_text(message + "\n", encoding="utf-8")
    return package_dir


def push_kernel(
    config: AgentConfig,
    package_dir: Path,
    *,
    timeout_seconds: int | None = None,
) -> KernelPushResult:
    setup_kaggle_credentials()
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()
    response = api.kernels_push(str(package_dir), timeout=timeout_seconds)
    kernel_slug = default_kernel_slug(config)
    version = getattr(response, "versionNumber", None)
    url = getattr(response, "url", "") or f"https://www.kaggle.com/code/{kernel_slug}"
    if url and not url.startswith("http"):
        url = f"https://www.kaggle.com{url}"
    return KernelPushResult(
        kernel_slug=kernel_slug,
        version=int(version) if version is not None else None,
        url=url,
        raw={"versionNumber": version, "url": url, "error": getattr(response, "error", None)},
    )


def wait_for_kernel(
    config: AgentConfig,
    kernel_slug: str,
    *,
    poll_seconds: int = 120,
    max_polls: int = 60,
) -> dict[str, Any]:
    setup_kaggle_credentials()
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()

    for attempt in range(max_polls):
        status_response = api.kernels_status(kernel_slug)
        status = str(getattr(status_response, "status", status_response)).upper()
        failure = getattr(status_response, "failureMessage", None)
        if status in {"COMPLETE", "COMPLETED"}:
            return {"status": status, "failure_message": failure, "attempts": attempt + 1}
        if status in {"FAILED", "ERROR", "CANCELLED"}:
            return {"status": status, "failure_message": failure, "attempts": attempt + 1}
        if attempt < max_polls - 1:
            time.sleep(poll_seconds)

    return {"status": "TIMEOUT", "failure_message": None, "attempts": max_polls}


def submit_code_competition(
    config: AgentConfig,
    *,
    kernel_slug: str,
    kernel_version: int | None,
    message: str,
    output_file: str = "submission.parquet",
) -> CompetitionSubmitResult:
    setup_kaggle_credentials()
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()
    response = api.competition_submit_code(
        output_file,
        message,
        config.competition,
        kernel=kernel_slug,
        kernel_version=kernel_version,
    )
    submission_id = str(
        getattr(response, "ref", None)
        or getattr(response, "submissionId", None)
        or ""
    )
    url = (
        f"https://www.kaggle.com/competitions/{config.competition}/submissions"
    )
    return CompetitionSubmitResult(
        submission_id=submission_id or None,
        kernel_slug=kernel_slug,
        kernel_version=kernel_version,
        message=message,
        url=url,
        raw=response,
    )
