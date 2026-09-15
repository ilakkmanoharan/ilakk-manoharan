# RSNA Knee MRI Classifier — portfolio research log

This tree powers the public project pages:

- `/projects/rsna-knee-mri-classifier` — overview, score chart, calendar
- `/projects/rsna-knee-mri-classifier/daily/YYYY-MM-DD` — day cards

## Layout

```text
research/
  config.json
  score-history.json
  daily/YYYY-MM-DD.json
  notes/_TEMPLATE.md
project_page_agent.py
```

## Agent schedule

GitHub Action `rsna-knee-project-page-agent.yml` runs hourly and **writes only when America/Chicago local hour is 23** (11 PM CT), unless manually dispatched with the eleven-pm gate skipped.

Sources of truth:

1. Kaggle API submissions for `rsna-knee-abnormality-detection` (when secrets present)
2. Checked-out [rsna-knee-mri-classifier](https://github.com/ilakkmanoharan/rsna-knee-mri-classifier) Agent1 `Analysis` / `Research` / `Hypothesis analysis` artifacts
3. Git log for that calendar day

Numeric scores are deterministic. Narrative fields stay factual; missing data is marked **Not recorded**.

## Local commands

```bash
cd rsna-knee-mri-classifier-research
pip install -r requirements.txt

# Dry run for today (Chicago)
python project_page_agent.py dry-run --rsna-repo ~/Projects/rsna-knee-mri-classifier

# Generate / update a day
python project_page_agent.py generate --date 2026-09-15 --rsna-repo ~/Projects/rsna-knee-mri-classifier --force

# Validate JSON
python project_page_agent.py validate
```

## Secrets

- `KAGGLE_API_TOKEN` or `KAGGLE_USERNAME` + `KAGGLE_KEY`
- Never commit credentials

## Research notes

Copy `research/notes/_TEMPLATE.md` per experiment during the day so the agent can attach stronger hypothesis provenance.
