import fs from "node:fs";
import path from "node:path";

export type ArcAgi3TimelineEvent = {
  id?: string;
  date: string;
  time: string;
  event_type: string;
  submission_id: string;
  status: string;
  score: string;
  kaggle_url: string;
  github_documents: string[];
  summary: string;
  extra?: Record<string, unknown>;
};

export type ArcAgi3ResearchData = {
  version: number;
  competition: string;
  competition_url?: string;
  research_end?: string;
  latest_submission_id: string | null;
  latest_score: string | number | null;
  latest_hypothesis_path: string | null;
  latest_strategy_path: string | null;
  events: ArcAgi3TimelineEvent[];
  updated_at?: string;
};

const RESEARCH_DIR = path.join(process.cwd(), "arc-agi-3-research", "research");

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function loadArcAgi3Research(): ArcAgi3ResearchData {
  const timeline =
    readJsonFile<ArcAgi3ResearchData>(path.join(RESEARCH_DIR, "timeline.json")) ??
    readJsonFile<ArcAgi3ResearchData>(
      path.join(RESEARCH_DIR, "portfolio-manifest.json"),
    );

  if (!timeline) {
    return {
      version: 1,
      competition: "arc-prize-2026-arc-agi-3",
      competition_url:
        "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
      research_end: "2026-11-01",
      latest_submission_id: null,
      latest_score: null,
      latest_hypothesis_path: null,
      latest_strategy_path: null,
      events: [],
    };
  }

  return {
    version: timeline.version ?? 1,
    competition: timeline.competition ?? "arc-prize-2026-arc-agi-3",
    competition_url:
      timeline.competition_url ??
      "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
    research_end: timeline.research_end ?? "2026-11-01",
    latest_submission_id: timeline.latest_submission_id ?? null,
    latest_score: timeline.latest_score ?? null,
    latest_hypothesis_path: timeline.latest_hypothesis_path ?? null,
    latest_strategy_path: timeline.latest_strategy_path ?? null,
    events: timeline.events ?? [],
    updated_at:
      "updated_at" in timeline && typeof timeline.updated_at === "string"
        ? timeline.updated_at
        : undefined,
  };
}

export function githubResearchUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "");
  return `https://github.com/ilakkmanoharan/ilakk-manoharan/blob/main/${clean}`;
}

export const EVENT_LABELS: Record<string, string> = {
  cycle_started: "Cycle started",
  cycle_completed: "Cycle completed",
  submission_created: "Submission created",
  status_checked: "Status checked",
  logs_retrieved: "Logs retrieved",
  analysis_created: "Analysis created",
  hypothesis_created: "Hypothesis created",
  strategy_created: "Strategy created",
  success_recorded: "Success recorded",
  failure_recorded: "Failure recorded",
  fix_committed: "Fix committed",
  resubmitted: "Resubmitted",
  portfolio_updated: "Portfolio updated",
};
