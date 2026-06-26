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

export type ArcAgi3SubmissionHistoryEntry = {
  name: string;
  date: string;
  score: string;
  status: string;
  note: string;
};

export type ArcAgi3StatusSummary = {
  updated_at?: string;
  public_score?: string | number | null;
  latest_submission_id?: string | null;
  agent_auto_submit?: boolean;
  next_cycle_utc?: string;
  notebook_status?: string;
  current_hypothesis?: string;
  planned_direction?: string;
  planned_direction_url?: string;
  last_cycle_status?: string;
  last_agent_submission?: {
    submission_id?: string | null;
    status?: string;
    kernel_slug?: string;
    summary?: string;
  };
  submission_history?: ArcAgi3SubmissionHistoryEntry[];
  known_blockers?: string[];
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
  status_summary?: ArcAgi3StatusSummary;
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
  const statusSummary = readJsonFile<ArcAgi3StatusSummary>(
    path.join(RESEARCH_DIR, "status-summary.json"),
  );

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
      status_summary: statusSummary ?? undefined,
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
    latest_score:
      statusSummary?.public_score ?? timeline.latest_score ?? null,
    latest_hypothesis_path: timeline.latest_hypothesis_path ?? null,
    latest_strategy_path: timeline.latest_strategy_path ?? null,
    events: timeline.events ?? [],
    updated_at:
      statusSummary?.updated_at ??
      ("updated_at" in timeline && typeof timeline.updated_at === "string"
        ? timeline.updated_at
        : undefined),
    status_summary: statusSummary ?? undefined,
  };
}

const RESEARCH_REPO_PREFIX = "arc-agi-3-research";

export function githubResearchUrl(relativePath: string): string {
  const clean = relativePath.replace(/^\/+/, "");
  const prefixed = clean.startsWith(`${RESEARCH_REPO_PREFIX}/`)
    ? clean
    : `${RESEARCH_REPO_PREFIX}/${clean}`;
  return `https://github.com/ilakkmanoharan/ilakk-manoharan/blob/main/${prefixed}`;
}

export function githubResearchTreeUrl(): string {
  return `https://github.com/ilakkmanoharan/ilakk-manoharan/tree/main/${RESEARCH_REPO_PREFIX}/research`;
}

/** Ignore placeholder IDs from dry-run / draft cycles. */
export function effectiveLatestSubmissionId(
  data: ArcAgi3ResearchData,
): string | null {
  const id = data.latest_submission_id;
  if (id && id !== "dry-run" && id !== "pending") {
    return id;
  }
  for (const event of [...data.events].reverse()) {
    const sid = event.submission_id;
    if (sid && sid !== "dry-run" && sid !== "pending") {
      return sid;
    }
  }
  return null;
}

export function formatArcAgi3Score(
  score: string | number | null | undefined,
): string {
  if (score === null || score === undefined || score === "") {
    return "0.00";
  }
  return String(score);
}

export function latestCycleStatus(data: ArcAgi3ResearchData): string {
  const summary = data.status_summary;
  if (summary?.last_cycle_status) {
    return String(summary.last_cycle_status);
  }
  for (const event of [...data.events].reverse()) {
    if (event.event_type === "cycle_completed") {
      return event.status || event.summary || "—";
    }
  }
  return "—";
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
  dataset_exported: "Dataset exported",
  lora_analysis_created: "LoRA analysis created",
};
