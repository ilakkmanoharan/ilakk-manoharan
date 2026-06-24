from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
RESEARCH_ROOT = REPO_ROOT / "research"

EVENT_TYPES = frozenset(
    {
        "submission_created",
        "status_checked",
        "logs_retrieved",
        "analysis_created",
        "hypothesis_created",
        "strategy_created",
        "success_recorded",
        "failure_recorded",
        "fix_committed",
        "resubmitted",
        "portfolio_updated",
        "cycle_started",
        "cycle_completed",
    }
)


@dataclass(frozen=True)
class AgentConfig:
    repo_root: Path
    research_root: Path
    competition: str
    kaggle_username: str | None
    kaggle_key: str | None
    kaggle_api_token: str | None
    kaggle_kernel_slug: str
    kaggle_base_kernel: str
    kaggle_output_file: str
    openai_api_key: str | None
    openai_model: str
    dry_run: bool
    auto_submit: bool

    @classmethod
    def from_env(cls, repo_root: Path | None = None) -> AgentConfig:
        root = repo_root or REPO_ROOT
        dry_run = os.getenv("ARC_AGENT_DRY_RUN", "").lower() in {"1", "true", "yes"}
        auto_submit = os.getenv("ARC_AGENT_AUTO_SUBMIT", "").lower() in {
            "1",
            "true",
            "yes",
        }
        token = os.getenv("KAGGLE_API_TOKEN") or None
        key = os.getenv("KAGGLE_KEY") or token
        return cls(
            repo_root=root,
            research_root=root / "research",
            competition=os.getenv(
                "KAGGLE_COMPETITION", "arc-prize-2026-arc-agi-3"
            ),
            kaggle_username=os.getenv("KAGGLE_USERNAME", "ilakkmanoharan"),
            kaggle_key=key,
            kaggle_api_token=token or key,
            kaggle_kernel_slug=os.getenv(
                "KAGGLE_KERNEL_SLUG", "arc-agi-3-research-agent"
            ),
            kaggle_base_kernel=os.getenv(
                "KAGGLE_BASE_KERNEL", "ilakkmanoharan/asra-phase-4-arc-prize-2026"
            ),
            kaggle_output_file=os.getenv("KAGGLE_OUTPUT_FILE", "submission.parquet"),
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            openai_model=os.getenv("OPENAI_MODEL", "gpt-4.1-mini"),
            dry_run=dry_run,
            auto_submit=auto_submit,
        )

    def has_kaggle(self) -> bool:
        if self.dry_run:
            return False
        return bool(self.kaggle_api_token or (self.kaggle_username and self.kaggle_key))

    def has_openai(self) -> bool:
        return bool(self.openai_api_key) and not self.dry_run
