from __future__ import annotations

import json
import shutil
from pathlib import Path

from agent.config import AgentConfig
from agent.lora_client import resolve_lora_cache_embed, sync_lora_support_files


def _load_notebook(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _save_notebook(path: Path, nb: dict) -> None:
    path.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def _markdown_cell(source: str) -> dict:
    lines = source.strip().split("\n")
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in lines],
    }


def apply_strategy_to_notebook(
    config: AgentConfig,
    *,
    notebook_path: Path,
    strategy_path: Path,
    day: str,
    intervention: str,
    exploration_plan: list[str],
) -> Path:
    """Inject LoRA strategy stamp into notebook and stage adapter support files."""
    sync_lora_support_files(config)

    if not notebook_path.exists():
        return notebook_path

    strategy_excerpt = strategy_path.read_text(encoding="utf-8")[:3500]
    exploration = ", ".join(exploration_plan[:6]) or "ACTION1, RESET"
    stamp = (
        f"# ARC-AGI-3 Research Agent — LoRA intervention ({day})\n\n"
        f"**Intervention:** {intervention}\n\n"
        f"**ExplorationLoRA plan:** {exploration}\n\n"
        f"**Strategy:** see `{strategy_path.relative_to(config.repo_root)}`\n\n"
        f"HypothesisLoRA cache packaged from `research/adapters/` when available.\n"
    )

    nb = _load_notebook(notebook_path)
    cells = nb.get("cells", [])

    # Remove prior auto-stamp cells to avoid duplication.
    filtered = []
    for cell in cells:
        src = "".join(cell.get("source", []))
        if src.startswith("# ARC-AGI-3 Research Agent — LoRA intervention"):
            continue
        filtered.append(cell)

    nb["cells"] = [_markdown_cell(stamp), *filtered]
    _save_notebook(notebook_path, nb)

    support_dir = config.research_root / "notebooks" / day / "support"
    support_dir.mkdir(parents=True, exist_ok=True)
    embed = resolve_lora_cache_embed(config)
    if embed:
        shutil.copy2(embed, support_dir / embed.name)

    context_path = config.research_root / "notebooks" / day / "submission-context.md"
    context_path.write_text(
        f"# Next submission context\n\n"
        f"## LoRA intervention\n\n{intervention}\n\n"
        f"## Exploration plan\n\n{exploration}\n\n"
        f"## Full strategy\n\n```markdown\n{strategy_excerpt}\n```\n",
        encoding="utf-8",
    )
    return notebook_path


def copy_adapter_files_to_kernel_package(
    config: AgentConfig,
    package_dir: Path,
) -> list[Path]:
    """Attach LoRA cache embed alongside notebook in kernel package."""
    copied: list[Path] = []
    embed_src = config.research_root / "adapters" / "hypothesis_lora_kaggle_cache_embed.py"
    if not embed_src.exists():
        sync_lora_support_files(config)
    if embed_src.exists():
        dest = package_dir / embed_src.name
        shutil.copy2(embed_src, dest)
        copied.append(dest)
    manifest = config.research_root / "adapters" / "manifest.json"
    if manifest.exists():
        dest = package_dir / "manifest.json"
        shutil.copy2(manifest, dest)
        copied.append(dest)
    return copied
