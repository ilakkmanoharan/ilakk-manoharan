from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass
class ParsedTransition:
    state_hash: str
    action: str
    diff_summary: str
    num_changed_cells: int
    outcome: str
    raw_line: str


@dataclass
class LogAnalysis:
    transitions: list[ParsedTransition] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    score_mentions: list[str] = field(default_factory=list)
    action_counts: dict[str, int] = field(default_factory=dict)
    label_hints: dict[str, int] = field(default_factory=dict)
    summary_lines: list[str] = field(default_factory=list)

    def to_context(self) -> str:
        lines = [
            f"Transitions parsed: {len(self.transitions)}",
            f"Errors: {len(self.errors)}",
            f"Action counts: {self.action_counts}",
            f"Label hints: {self.label_hints}",
        ]
        if self.score_mentions:
            lines.append(f"Score mentions: {', '.join(self.score_mentions[:5])}")
        if self.errors:
            lines.append("Top errors:")
            lines.extend(f"  - {e}" for e in self.errors[:8])
        if self.transitions:
            lines.append("Sample transitions:")
            for t in self.transitions[:6]:
                lines.append(
                    f"  - {t.state_hash[:12]}|{t.action} "
                    f"({t.diff_summary}, outcome={t.outcome})"
                )
        return "\n".join(lines)


_ACTION_RE = re.compile(r"\b(ACTION\d+|RESET)\b")
_STATE_RE = re.compile(r"state[_\s-]?hash[=:\s]+([a-f0-9]{8,})", re.I)
_CHANGED_RE = re.compile(r"changed[_\s-]?cells[=:\s]+(\d+)", re.I)
_SCORE_RE = re.compile(r"(score|publicScore)[=:\s]+([0-9.]+)", re.I)
_ERROR_RE = re.compile(r"(error|exception|traceback|failed)", re.I)


def _parse_json_log_lines(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8", errors="ignore")
    if not text.strip().startswith("["):
        return text.splitlines()
    try:
        records = json.loads(text)
    except json.JSONDecodeError:
        return text.splitlines()
    lines: list[str] = []
    for record in records:
        if isinstance(record, dict):
            data = record.get("data", "")
            if isinstance(data, str):
                lines.extend(data.replace("\r", "").split("\n"))
    return lines


def parse_log_paths(log_paths: list[Path]) -> LogAnalysis:
    analysis = LogAnalysis()
    for path in log_paths:
        if path.suffix.lower() not in {".log", ".txt", ".json"}:
            continue
        if not path.exists():
            continue
        lines = _parse_json_log_lines(path)
        for line in lines:
            line = line.strip()
            if not line:
                continue
            if len(analysis.summary_lines) < 40:
                analysis.summary_lines.append(line[:240])

            if _ERROR_RE.search(line):
                analysis.errors.append(line[:300])

            score_match = _SCORE_RE.search(line)
            if score_match:
                analysis.score_mentions.append(score_match.group(0))

            action_match = _ACTION_RE.search(line)
            if not action_match:
                continue

            action = action_match.group(1)
            analysis.action_counts[action] = analysis.action_counts.get(action, 0) + 1

            state_match = _STATE_RE.search(line)
            state_hash = state_match.group(1) if state_match else f"log{hash(line) & 0xFFFFFFFF:08x}"

            changed = 0
            changed_match = _CHANGED_RE.search(line)
            if changed_match:
                changed = int(changed_match.group(1))

            diff_summary = f"changed_cells={changed}" if changed else "log_inferred"
            outcome = "error" if _ERROR_RE.search(line) else "observed"

            if "terminal" in line.lower():
                analysis.label_hints["terminal_transition"] = (
                    analysis.label_hints.get("terminal_transition", 0) + 1
                )
            elif "dead" in line.lower():
                analysis.label_hints["dead_end"] = analysis.label_hints.get("dead_end", 0) + 1
            elif changed == 0:
                analysis.label_hints["no_change"] = analysis.label_hints.get("no_change", 0) + 1
            else:
                analysis.label_hints["small_change"] = (
                    analysis.label_hints.get("small_change", 0) + 1
                )

            analysis.transitions.append(
                ParsedTransition(
                    state_hash=state_hash,
                    action=action,
                    diff_summary=diff_summary,
                    num_changed_cells=changed,
                    outcome=outcome,
                    raw_line=line[:400],
                )
            )

    return analysis
