#!/usr/bin/env python3
"""Run the full daily ARC-AGI-3 research cycle."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import replace
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from agent.config import AgentConfig
from agent.cycle import DailyResearchCycle


def main() -> int:
    parser = argparse.ArgumentParser(description="ARC-AGI-3 daily research cycle")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Skip live Kaggle/OpenAI calls",
    )
    args = parser.parse_args()

    config = AgentConfig.from_env(ROOT)
    if args.dry_run:
        config = replace(config, dry_run=True)

    result = DailyResearchCycle(config).run()
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
