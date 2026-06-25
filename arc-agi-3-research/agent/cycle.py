from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from agent.config import AgentConfig
from agent.kaggle_client import KaggleClient
from agent.kernel_submitter import (
    build_kernel_package,
    default_kernel_slug,
    push_kernel,
    submit_code_competition,
    wait_for_kernel,
)
from agent.portfolio_sync import (
    sync_timeline_summary_fields,
    update_portfolio_manifest,
    write_status_summary,
)
from agent.research_analyzer import (
    generate_analysis_artifacts,
    generate_hypothesis,
    generate_strategy,
)
from agent.timeline import TimelineStore


def _utc_day() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _ensure_notebook(config: AgentConfig, strategy_path: Path) -> Path:
    notebooks_dir = config.research_root / "notebooks"
    notebooks_dir.mkdir(parents=True, exist_ok=True)
    target = notebooks_dir / "arc_agi_3_next_submission.ipynb"
    starter = config.repo_root / "notebooks" / "arc_agi_3_next_submission.ipynb"

    if not target.exists() and starter.exists():
        shutil.copy2(starter, target)

    if config.has_kaggle() and _notebook_is_scaffold(target):
        _bootstrap_notebook_from_kernel(config, target)

    stamp = notebooks_dir / _utc_day() / "submission-context.md"
    stamp.parent.mkdir(parents=True, exist_ok=True)
    stamp.write_text(
        f"# Next submission context\n\nBased on:\n\n`{strategy_path.relative_to(config.repo_root)}`\n",
        encoding="utf-8",
    )
    return target


def _notebook_is_scaffold(path: Path) -> bool:
    if not path.exists():
        return True
    text = path.read_text(encoding="utf-8", errors="ignore")
    return "submission scaffold" in text.lower() or len(text) < 1200


def _bootstrap_notebook_from_kernel(config: AgentConfig, target: Path) -> None:
    from agent.kaggle_auth import setup_kaggle_credentials

    setup_kaggle_credentials()
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()
    pull_dir = config.research_root / "notebooks" / "_bootstrap"
    if pull_dir.exists():
        shutil.rmtree(pull_dir)
    pull_dir.mkdir(parents=True, exist_ok=True)
    api.kernels_pull(config.kaggle_base_kernel, path=str(pull_dir), metadata=True)
    pulled = list(pull_dir.glob("*.ipynb"))
    if pulled:
        shutil.copy2(pulled[0], target)


class DailyResearchCycle:
    """Orchestrates the nine-phase daily research loop from spec v1.0."""

    def __init__(self, config: AgentConfig | None = None) -> None:
        self.config = config or AgentConfig.from_env()
        self.timeline = TimelineStore(self.config)
        self.kaggle = KaggleClient(self.config)

    def run(self) -> dict[str, Any]:
        day = _utc_day()
        self.timeline.append_event(
            "cycle_started",
            summary=f"Daily research cycle started for {day}",
        )

        submission = self._phase_retrieve_submission(day)
        log_paths = self._phase_retrieve_logs(day, submission)
        analysis_paths = self._phase_analysis(day, submission, log_paths)
        hypothesis_path = self._phase_hypothesis(day, analysis_paths)
        strategy_path = self._phase_strategy(day, hypothesis_path)
        commit_note = self._phase_record_commit(
            day, analysis_paths, hypothesis_path, strategy_path
        )
        manifest_path = self._phase_portfolio_update(
            submission, hypothesis_path, strategy_path
        )
        notebook_path = _ensure_notebook(self.config, strategy_path)
        submit_result = self._phase_submit(day, notebook_path, strategy_path)

        if submit_result.get("submission_id"):
            data = self.timeline.load()
            data = sync_timeline_summary_fields(
                data,
                submission_id=str(submit_result["submission_id"]),
                score=submit_result.get("score"),
            )
            self.timeline.save(data)
            update_portfolio_manifest(self.config, data)

        notebook_note = (
            "arc_agi_3_next_submission.ipynb"
            if notebook_path.exists()
            else "notebook missing"
        )
        if _notebook_is_scaffold(notebook_path):
            notebook_note += " — ASRA Phase 4 bootstrap (no strategy edits applied yet)"
        write_status_summary(
            self.config,
            self.timeline.load(),
            submit_result=submit_result,
            notebook_note=notebook_note,
        )

        self.timeline.append_event(
            "cycle_completed",
            submission_id=submit_result.get("submission_id") or submission.submission_id,
            status=submit_result.get("status") or submission.status,
            score=submit_result.get("score") or submission.score,
            kaggle_url=submit_result.get("url") or submission.url,
            github_documents=self.timeline.relative_paths(
                *analysis_paths.values(),
                hypothesis_path,
                strategy_path,
                manifest_path,
            ),
            summary=f"Daily cycle completed for {day}",
        )

        return {
            "day": day,
            "submission_id": submit_result.get("submission_id") or submission.submission_id,
            "status": submit_result.get("status") or submission.status,
            "score": submit_result.get("score") or submission.score,
            "analysis": [str(p) for p in analysis_paths.values()],
            "hypothesis": str(hypothesis_path),
            "strategy": str(strategy_path),
            "manifest": str(manifest_path),
            "notebook": str(notebook_path),
            "commit_note": commit_note,
            "submit": submit_result,
            "dry_run": self.config.dry_run or not self.config.has_kaggle(),
        }

    def _phase_retrieve_submission(self, day: str):
        submissions_dir = self.timeline.day_dir("submissions", day)
        if self.config.has_kaggle():
            submission = self.kaggle.latest_submission()
            if submission is None:
                submission = self.kaggle.dry_run_submission()
        else:
            submission = self.kaggle.dry_run_submission()

        snapshot = self.kaggle.save_submission_snapshot(submission, submissions_dir)
        self.timeline.append_event(
            "status_checked",
            submission_id=submission.submission_id,
            status=submission.status,
            score=submission.score,
            kaggle_url=submission.url,
            github_documents=self.timeline.relative_paths(snapshot),
            summary=(
                f"Retrieved latest Kaggle submission "
                f"({submission.status}, score={submission.score})"
            ),
            extra={
                "notebook_url": submission.notebook_url,
                "kernel_slug": submission.kernel_slug,
            },
        )
        return submission

    def _phase_retrieve_logs(self, day: str, submission) -> list[Path]:
        logs_dir = self.timeline.day_dir("logs", day)
        if self.config.has_kaggle():
            paths = self.kaggle.download_submission_logs(submission, logs_dir)
        else:
            readme = logs_dir / "README.txt"
            readme.write_text("Dry-run log placeholder\n", encoding="utf-8")
            paths = [readme]

        self.timeline.append_event(
            "logs_retrieved",
            submission_id=submission.submission_id,
            github_documents=self.timeline.relative_paths(*paths[:12]),
            summary=f"Retrieved {len(paths)} log artifact(s) for latest submission",
        )
        return paths

    def _phase_analysis(self, day: str, submission, log_paths: list[Path]):
        logs_summary = ", ".join(p.name for p in log_paths[:8])
        analysis_paths = generate_analysis_artifacts(
            self.config,
            day_dir_name=day,
            submission_status=submission.status,
            submission_score=submission.score,
            submission_summary=submission.description,
            logs_summary=logs_summary,
            use_openai=self.config.has_openai(),
        )
        self.timeline.append_event(
            "analysis_created",
            submission_id=submission.submission_id,
            status=submission.status,
            score=submission.score,
            github_documents=self.timeline.relative_paths(*analysis_paths.values()),
            summary="Generated success/failure/causal analysis and theory update",
        )
        event_type = (
            "failure_recorded"
            if submission.status in {"FAILED", "ERROR"}
            else "success_recorded"
        )
        self.timeline.append_event(
            event_type,
            submission_id=submission.submission_id,
            status=submission.status,
            score=submission.score,
            summary=f"Recorded {event_type.replace('_', ' ')}",
        )
        return analysis_paths

    def _phase_hypothesis(self, day: str, analysis_paths: dict[str, Path]) -> Path:
        path = generate_hypothesis(
            self.config, day_dir_name=day, analysis_paths=analysis_paths
        )
        self.timeline.append_event(
            "hypothesis_created",
            github_documents=self.timeline.relative_paths(path),
            summary="Generated hypothesis from analysis artifacts",
        )
        return path

    def _phase_strategy(self, day: str, hypothesis_path: Path) -> Path:
        path = generate_strategy(
            self.config, day_dir_name=day, hypothesis_path=hypothesis_path
        )
        self.timeline.append_event(
            "strategy_created",
            github_documents=self.timeline.relative_paths(path),
            summary="Generated next-submission plan from hypothesis",
        )
        return path

    def _phase_record_commit(
        self,
        day: str,
        analysis_paths: dict[str, Path],
        hypothesis_path: Path,
        strategy_path: Path,
    ) -> str:
        note = f"ARC Research Update {day}"
        self.timeline.append_event(
            "fix_committed",
            github_documents=self.timeline.relative_paths(
                *analysis_paths.values(), hypothesis_path, strategy_path
            ),
            summary=f"Artifacts ready for git commit: {note}",
        )
        return note

    def _phase_portfolio_update(
        self, submission, hypothesis_path: Path, strategy_path: Path
    ) -> Path:
        data = self.timeline.load()
        data = sync_timeline_summary_fields(
            data,
            submission_id=submission.submission_id,
            score=submission.score,
            hypothesis_path=str(hypothesis_path.relative_to(self.config.repo_root)),
            strategy_path=str(strategy_path.relative_to(self.config.repo_root)),
        )
        self.timeline.save(data)
        manifest = update_portfolio_manifest(self.config, data)
        self.timeline.append_event(
            "portfolio_updated",
            submission_id=submission.submission_id,
            score=submission.score,
            github_documents=self.timeline.relative_paths(manifest),
            summary="Updated portfolio manifest for research page",
        )
        return manifest

    def _phase_submit(
        self, day: str, notebook_path: Path, strategy_path: Path
    ) -> dict[str, Any]:
        message = f"ARC-AGI-3 research agent — {day}"
        strategy_text = strategy_path.read_text(encoding="utf-8")
        if "## Intervention" in strategy_text:
            message = f"{message} — intervention from strategy plan"

        if not self.config.has_kaggle():
            note = "Submission skipped (dry run)."
            self.timeline.append_event(
                "submission_created",
                submission_id="pending",
                status="draft",
                github_documents=self.timeline.relative_paths(
                    notebook_path, strategy_path
                ),
                summary=note,
            )
            return {"status": "draft", "note": note}

        package_dir = build_kernel_package(
            self.config,
            notebook_path,
            message=message,
            day=day,
        )

        if not self.config.auto_submit:
            note = (
                "Kernel package prepared. Set ARC_AGENT_AUTO_SUBMIT=1 to push and "
                "submit to Kaggle."
            )
            self.timeline.append_event(
                "submission_created",
                status="prepared",
                github_documents=self.timeline.relative_paths(package_dir),
                summary=note,
            )
            return {"status": "prepared", "package_dir": str(package_dir), "note": note}

        push = push_kernel(self.config, package_dir)
        kernel_wait = wait_for_kernel(
            self.config,
            push.kernel_slug,
            poll_seconds=60,
            max_polls=45,
            initial_delay_seconds=30,
        )
        resolved_slug = kernel_wait.get("kernel_slug") or push.kernel_slug
        if kernel_wait["status"] not in {"COMPLETE", "COMPLETED"}:
            note = (
                f"Kernel push finished but run status={kernel_wait['status']}; "
                "competition submit skipped."
            )
            self.timeline.append_event(
                "failure_recorded",
                status=kernel_wait["status"],
                kaggle_url=push.url,
                github_documents=self.timeline.relative_paths(package_dir),
                summary=note,
                extra=kernel_wait,
            )
            return {
                "status": kernel_wait["status"],
                "kernel_url": push.url,
                "note": note,
            }

        submit = submit_code_competition(
            self.config,
            kernel_slug=resolved_slug,
            kernel_version=push.version,
            message=message,
            output_file=self.config.kaggle_output_file,
        )
        self.timeline.append_event(
            "submission_created",
            submission_id=submit.submission_id or "",
            status="SUBMITTED",
            kaggle_url=submit.url,
            github_documents=self.timeline.relative_paths(package_dir),
            summary=f"Submitted kernel {resolved_slug} v{push.version}",
            extra={
                "kernel_url": push.url,
                "kernel_version": push.version,
                "kernel_slug": resolved_slug,
            },
        )
        self.timeline.append_event(
            "resubmitted",
            submission_id=submit.submission_id or "",
            kaggle_url=submit.url,
            summary=message,
        )
        return {
            "submission_id": submit.submission_id,
            "status": "SUBMITTED",
            "kernel_slug": resolved_slug,
            "kernel_version": push.version,
            "kernel_url": push.url,
            "url": submit.url,
            "note": message,
        }
