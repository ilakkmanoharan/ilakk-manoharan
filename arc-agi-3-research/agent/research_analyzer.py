from __future__ import annotations

from pathlib import Path

from agent.config import AgentConfig


ANALYSIS_FILES = (
    "success-analysis.md",
    "failure-analysis.md",
    "causal-analysis.md",
    "theory.md",
)


def _read_optional(path: Path) -> str:
    return path.read_text(encoding="utf-8") if path.exists() else ""


def _template_block(title: str, body: str) -> str:
    return f"## {title}\n\n{body.strip() or '_Pending._'}\n"


def generate_analysis_artifacts(
    config: AgentConfig,
    *,
    day_dir_name: str,
    submission_status: str,
    submission_score: str | float | None,
    submission_summary: str,
    logs_summary: str,
    use_openai: bool,
) -> dict[str, Path]:
    analysis_dir = config.research_root / "analysis" / day_dir_name
    analysis_dir.mkdir(parents=True, exist_ok=True)

    context = (
        f"Submission status: {submission_status}\n"
        f"Score: {submission_score}\n"
        f"Summary: {submission_summary}\n"
        f"Logs: {logs_summary}\n"
    )

    if use_openai and config.has_openai():
        contents = _generate_with_openai(config, context)
    else:
        contents = _generate_stub(context, submission_status)

    paths: dict[str, Path] = {}
    for name, body in contents.items():
        path = analysis_dir / name
        path.write_text(body, encoding="utf-8")
        paths[name] = path
    return paths


def _generate_stub(context: str, status: str) -> dict[str, str]:
    is_failure = status.lower() in {"failed", "error"}
    questions = (
        "- What happened?\n"
        "- Why did it happen?\n"
        "- What changed?\n"
        "- What failed?\n"
        "- What succeeded?\n"
        "- What evidence supports this?\n"
        "- What mechanism explains this?\n"
    )
    return {
        "success-analysis.md": (
            "# Success analysis\n\n"
            + (context if not is_failure else "No success recorded for this cycle.\n")
            + "\n\n### Questions\n\n"
            + questions
        ),
        "failure-analysis.md": (
            "# Failure analysis\n\n"
            + (context if is_failure else "No failure recorded for this cycle.\n")
            + "\n\n### Questions\n\n"
            + questions
        ),
        "causal-analysis.md": (
            "# Causal analysis\n\n"
            f"{context}\n\n"
            "## Causal chain (draft)\n\n"
            "Observation → Failure mode → Causal explanation → Hypothesis → "
            "Intervention → Submission → Result → Updated theory\n"
        ),
        "theory.md": (
            "# Theory update\n\n"
            f"{context}\n\n"
            "## Working theory\n\n"
            "Transition-centric reasoning over ARC-AGI-3 environments: action "
            "semantics must be inferred from state transitions, not assumed.\n"
        ),
    }


def _generate_with_openai(config: AgentConfig, context: str) -> dict[str, str]:
    from openai import OpenAI

    client = OpenAI(api_key=config.openai_api_key)
    prompt = (
        "You are an autonomous scientific research agent for ARC-AGI-3 (ASRA). "
        "Given the submission context below, produce four markdown documents. "
        "Return strict JSON with keys: success-analysis, failure-analysis, "
        "causal-analysis, theory. Each value is markdown body only (no JSON).\n\n"
        f"{context}"
    )
    response = client.responses.create(
        model=config.openai_model,
        input=prompt,
    )
    text = response.output_text
    try:
        import json

        parsed = json.loads(text)
        return {
            "success-analysis.md": f"# Success analysis\n\n{parsed.get('success-analysis', '')}",
            "failure-analysis.md": f"# Failure analysis\n\n{parsed.get('failure-analysis', '')}",
            "causal-analysis.md": f"# Causal analysis\n\n{parsed.get('causal-analysis', '')}",
            "theory.md": f"# Theory\n\n{parsed.get('theory', '')}",
        }
    except Exception:
        return _generate_stub(context, "unknown")


def generate_hypothesis(
    config: AgentConfig,
    *,
    day_dir_name: str,
    analysis_paths: dict[str, Path],
) -> Path:
    hypotheses_dir = config.research_root / "hypotheses" / day_dir_name
    hypotheses_dir.mkdir(parents=True, exist_ok=True)
    template_path = config.repo_root / "templates" / "hypothesis.md"
    template = template_path.read_text(encoding="utf-8")

    observation = _read_optional(analysis_paths.get("failure-analysis.md", Path()))
    evidence = _read_optional(analysis_paths.get("causal-analysis.md", Path()))
    theory = _read_optional(analysis_paths.get("theory.md", Path()))

    body = template.format(
        observation=observation[:2000] or "_See analysis artifacts._",
        evidence=evidence[:2000] or "_See causal analysis._",
        interpretation=theory[:1500] or "_Pending interpretation._",
        hypothesis=(
            "Improving transition logging and action-semantics recovery will "
            "raise ARC-AGI-3 milestone scores on the next submission."
        ),
        intervention=(
            "Extend ASRA Phase 1 transition schema, add replay buffer, and "
            "tighten exploration policy under fixed step budget."
        ),
        expected_outcome="Higher completion rate on hidden-mechanism games.",
        risks="Overfitting to a single game family; notebook runtime limits.",
        next_experiment="Ablate exploration memory vs baseline on one held-out game.",
    )
    out = hypotheses_dir / "hypothesis.md"
    out.write_text(body, encoding="utf-8")
    return out


def generate_strategy(
    config: AgentConfig,
    *,
    day_dir_name: str,
    hypothesis_path: Path,
) -> Path:
    strategies_dir = config.research_root / "strategies" / day_dir_name
    strategies_dir.mkdir(parents=True, exist_ok=True)
    template_path = config.repo_root / "templates" / "next-submission-plan.md"
    template = template_path.read_text(encoding="utf-8")
    hypothesis_excerpt = hypothesis_path.read_text(encoding="utf-8")[:2500]

    body = template.format(
        hypothesis_excerpt=hypothesis_excerpt,
        notebook_modifications=(
            "- Update `notebooks/arc_agi_3_next_submission.ipynb` bootstrap\n"
            "- Pin ASRA phase modules used in agent loop\n"
            "- Log transitions to JSONL under research/logs/"
        ),
        architecture_changes=(
            "- Strengthen transition-centric memory store\n"
            "- Add causal hypothesis ranking before action selection"
        ),
        feature_additions="- Directed exploration under step budget",
        ablations="- Memory off vs memory on\n- Random vs directed exploration",
        experiment_plan=(
            "1. Implement intervention from hypothesis\n"
            "2. Run local smoke test\n"
            "3. Submit notebook to Kaggle\n"
            "4. Monitor status every 2 hours"
        ),
    )
    out = strategies_dir / "next-submission-plan.md"
    out.write_text(body, encoding="utf-8")
    return out
