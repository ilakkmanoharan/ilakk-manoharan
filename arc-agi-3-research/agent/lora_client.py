from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path
from typing import Any

from agent.config import AgentConfig
from agent.log_parser import LogAnalysis, ParsedTransition


def resolve_asra_lora_repo(config: AgentConfig) -> Path | None:
    candidates = [
        config.asra_lora_repo,
        Path.home() / "Projects" / "ASRA-LoRA",
        Path.home() / "ASRA-LoRA",
        config.repo_root.parent / "ASRA-LoRA",
    ]
    for path in candidates:
        if path and path.exists() and (path / "infer" / "hypothesis_lora.py").exists():
            return path.resolve()
    return None


def resolve_adapter_dir(config: AgentConfig) -> Path | None:
    if config.hypothesis_adapter_dir:
        path = Path(config.hypothesis_adapter_dir)
        if path.exists():
            return path.resolve()
    repo = resolve_asra_lora_repo(config)
    if repo:
        default = repo / "adapters" / "hypothesis-lora-v0"
        if default.exists():
            return default
    bundled = config.research_root / "adapters" / "hypothesis-lora-v0"
    if bundled.exists():
        return bundled
    return None


def resolve_lora_cache_embed(config: AgentConfig) -> Path | None:
    if config.lora_cache_embed_path:
        path = Path(config.lora_cache_embed_path)
        if path.exists():
            return path.resolve()
    repo = resolve_asra_lora_repo(config)
    if repo:
        embed = repo / "adapters" / "hypothesis_lora_kaggle_cache_embed.py"
        if embed.exists():
            return embed
    bundled = config.research_root / "adapters" / "hypothesis_lora_kaggle_cache_embed.py"
    if bundled.exists():
        return bundled
    return None


def _heuristic_label(transition: ParsedTransition) -> str:
    if transition.outcome == "error":
        return "dead_end"
    if transition.num_changed_cells == 0:
        return "no_change"
    if transition.action == "RESET":
        return "repeated_state"
    if "terminal" in transition.raw_line.lower():
        return "terminal_transition"
    if transition.num_changed_cells >= 8:
        return "large_change"
    return "small_change"


def classify_transitions_heuristic(
    transitions: list[ParsedTransition],
) -> dict[str, str]:
    labels: dict[str, str] = {}
    for transition in transitions:
        key = f"{transition.state_hash[:16]}|{transition.action}"
        labels[key] = _heuristic_label(transition)
    return labels


def classify_transitions_with_hypothesis_lora(
    config: AgentConfig,
    transitions: list[ParsedTransition],
) -> tuple[dict[str, str], str]:
    """Returns (labels_by_key, mode). mode is hypothesis_lora | heuristic."""
    if not transitions:
        return {}, "empty"

    adapter_dir = resolve_adapter_dir(config)
    repo = resolve_asra_lora_repo(config)

    if adapter_dir and repo and config.lora_inference_mode != "heuristic":
        try:
            sys.path.insert(0, str(repo))
            from infer.hypothesis_lora import HypothesisLoRA  # type: ignore

            model = HypothesisLoRA(adapter_dir=str(adapter_dir))
            labels: dict[str, str] = {}
            for transition in transitions[:200]:
                key = f"{transition.state_hash[:16]}|{transition.action}"
                result = model.classify_action_effect(
                    transition.state_hash,
                    transition.action,
                    transition.diff_summary,
                    transition.num_changed_cells,
                )
                labels[key] = str(result.get("semantic_label", "small_change"))
            return labels, "hypothesis_lora"
        except Exception:
            pass

        try:
            labels = _classify_via_subprocess(repo, adapter_dir, transitions[:50])
            if labels:
                return labels, "hypothesis_lora_subprocess"
        except Exception:
            pass

    return classify_transitions_heuristic(transitions), "heuristic"


def _classify_via_subprocess(
    repo: Path,
    adapter_dir: Path,
    transitions: list[ParsedTransition],
) -> dict[str, str]:
    script = """
import json, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from infer.hypothesis_lora import HypothesisLoRA
payload = json.loads(sys.stdin.read())
model = HypothesisLoRA(adapter_dir=payload["adapter_dir"])
out = {}
for row in payload["rows"]:
    key = row["key"]
    r = model.classify_action_effect(
        row["state_hash"], row["action"], row.get("diff_summary",""),
        int(row.get("num_changed_cells") or 0),
    )
    out[key] = r.get("semantic_label", "small_change")
print(json.dumps(out))
"""
    payload = {
        "adapter_dir": str(adapter_dir),
        "rows": [
            {
                "key": f"{t.state_hash[:16]}|{t.action}",
                "state_hash": t.state_hash,
                "action": t.action,
                "diff_summary": t.diff_summary,
                "num_changed_cells": t.num_changed_cells,
            }
            for t in transitions
        ],
    }
    import json

    proc = subprocess.run(
        [sys.executable, "-c", script],
        input=json.dumps(payload),
        cwd=str(repo),
        capture_output=True,
        text=True,
        timeout=600,
        env={**os.environ, "PYTHONPATH": str(repo)},
    )
    if proc.returncode != 0:
        return {}
    return json.loads(proc.stdout.strip())


def exploration_plan_from_labels(
    labels: dict[str, str],
    log_analysis: LogAnalysis,
) -> list[str]:
    """ExplorationLoRA placeholder — rule-based until D2 trainer ships."""
    dead_ends = sum(1 for v in labels.values() if v in {"dead_end", "no_change"})
    terminals = sum(1 for v in labels.values() if v == "terminal_transition")
    plan: list[str] = []
    if dead_ends > terminals:
        plan.append("RESET")
        plan.append("ACTION1")
        plan.append("Prefer untried actions on repeated no_change states")
    else:
        plan.append("ACTION2")
        plan.append("ACTION3")
        plan.append("Log transition JSONL for LoRA cache refresh")
    if log_analysis.errors:
        plan.append("Fix gateway/runtime errors before exploration policy changes")
    return plan


def failure_revision_from_score(
    score: str | float | None,
    log_analysis: LogAnalysis,
) -> str:
    """FailureLoRA placeholder — revision text for D3 training."""
    score_text = str(score) if score is not None else "unknown"
    if score_text in {"0", "0.0", "0.00", "None", "null"}:
        return (
            "Score still zero: gateway runs but game-solving is weak. "
            "Increase HypothesisLoRA cache coverage, bootstrap from ASRA Phase 7 "
            "with LoRA bridge, and export more transition rows from logs."
        )
    if log_analysis.errors:
        return (
            "Runtime errors detected — stabilize notebook imports and "
            "CausalSemanticsEngine before policy changes."
        )
    return "Continue LoRA-guided directed exploration under step budget."


def sync_lora_support_files(config: AgentConfig) -> list[Path]:
    """Copy Kaggle LoRA cache embed into research/adapters for notebook packaging."""
    embed_src = resolve_lora_cache_embed(config)
    if not embed_src:
        return []

    dest_dir = config.research_root / "adapters"
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "hypothesis_lora_kaggle_cache_embed.py"
    dest.write_text(embed_src.read_text(encoding="utf-8"), encoding="utf-8")

    manifest_src = resolve_asra_lora_repo(config)
    copied = [dest]
    if manifest_src:
        manifest = manifest_src / "adapters" / "manifest.json"
        if manifest.exists():
            manifest_dest = dest_dir / "manifest.json"
            manifest_dest.write_text(manifest.read_text(encoding="utf-8"), encoding="utf-8")
            copied.append(manifest_dest)
    return copied
