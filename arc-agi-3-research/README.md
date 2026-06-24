# ARC-AGI-3 Autonomous Research Agent

Autonomous cloud research loop for [ARC Prize 2026 — ARC-AGI-3](https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3), built on the ASRA framework. Runs on **GitHub Actions** until **November 1, 2026**.

## Goal

Not leaderboard optimization alone — a persistent scientific record:

- submit experiments
- evaluate outcomes
- study failures
- generate hypotheses
- develop theories
- improve future submissions

## Layout

```text
arc-agi-3-research/
  agent/                 # Python orchestration
  scripts/               # CLI entrypoints
  research/
    timeline.json        # Event log (all phases)
    submissions/         # Daily submission snapshots
    logs/                # Raw Kaggle logs (immutable)
    analysis/            # success/failure/causal/theory
    hypotheses/
    strategies/
    notebooks/
    reports/
  templates/
  notebooks/             # Next submission scaffold
```

## Local setup

```bash
cd arc-agi-3-research
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Dry-run the daily cycle (no API keys):

```bash
python scripts/run_daily_cycle.py --dry-run
```

## GitHub Secrets

```text
KAGGLE_API_TOKEN        # preferred — from kaggle.com/settings
# or legacy:
KAGGLE_USERNAME
KAGGLE_KEY

OPENAI_API_KEY          # optional — richer analysis
```

Workflow env:

```text
ARC_AGENT_AUTO_SUBMIT=1   # push kernel + submit (on in GitHub Actions)
ARC_AGENT_DRY_RUN=1       # test without API calls
KAGGLE_KERNEL_SLUG=arc-agi-3-research-agent
KAGGLE_BASE_KERNEL=ilakkmanoharan/asra-phase-4-arc-prize-2026
```

Never commit tokens.

## Daily cycle (9 phases)

1. Retrieve latest Kaggle submission
2. Retrieve logs
3. Research analysis (`success-analysis.md`, `failure-analysis.md`, `causal-analysis.md`, `theory.md`)
4. Hypothesis (`hypothesis.md`)
5. Strategy (`next-submission-plan.md`)
6. Commit research artifacts
7. Update portfolio manifest
8. Prepare next notebook
9. Submit to Kaggle — `kernels push` + `competition_submit_code` when `ARC_AGENT_AUTO_SUBMIT=1`

Status monitoring: `scripts/check_submission_status.py` polls every 2 hours until terminal state.

## Portfolio

Research timeline: https://ilakk-manoharan.vercel.app/projects/arc-agi-3

## Spec

See `private/projects/ARC-AGI-3-agent/spec2.md` for full v1.0 specification.
