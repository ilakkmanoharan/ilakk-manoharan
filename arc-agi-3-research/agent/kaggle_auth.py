from __future__ import annotations

import os
from pathlib import Path


def setup_kaggle_credentials() -> None:
    """Configure Kaggle API env from token or legacy username/key."""
    token = os.getenv("KAGGLE_API_TOKEN") or os.getenv("KAGGLE_KEY")
    if token:
        os.environ["KAGGLE_API_TOKEN"] = token
        return

    username = os.getenv("KAGGLE_USERNAME")
    key = os.getenv("KAGGLE_KEY")
    if username and key:
        kaggle_dir = Path.home() / ".kaggle"
        kaggle_dir.mkdir(parents=True, exist_ok=True)
        kaggle_json = kaggle_dir / "kaggle.json"
        if not kaggle_json.exists():
            kaggle_json.write_text(
                f'{{"username":"{username}","key":"{key}"}}\n',
                encoding="utf-8",
            )
        os.environ.setdefault("KAGGLE_USERNAME", username)
        os.environ.setdefault("KAGGLE_KEY", key)
