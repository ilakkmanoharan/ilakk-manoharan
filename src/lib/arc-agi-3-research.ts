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


/* ——— Project-page daily / score history (CASMI-style) ——— */

const PROJECT_PAGE_DIR = path.join(RESEARCH_DIR, "project-page");

export type ArcAgi3PageSubmission = {
  ref: string;
  timestamp: string;
  fileName?: string;
  description?: string;
  status: string;
  publicScore: number | null;
  privateScore?: number | null;
  strategy?: string;
};

export type ArcAgi3PageHypothesis = {
  id: string;
  statement: string;
  motivation?: string;
  changeBeingTested?: string;
  expectedResult?: string;
  observedResult?: string;
  evidence?: string[];
  status: string;
  linkedExperimentIds?: string[];
  linkedSubmissions?: string[];
  confidence?: string;
  caveats?: string;
};

export type ArcAgi3PageConcept = {
  name: string;
  why?: string;
  how?: string;
  source?: string;
};

export type ArcAgi3PageScoreSummary = {
  firstScored: number | null;
  lastScored: number | null;
  bestScore: number | null;
  worstScore: number | null;
  dailyAbsoluteChange: number | null;
  dailyPercentageChange: number | null;
  changeFromPreviousSubmission: number | null;
  changeFromPreviousClose: number | null;
  changeFromPriorBest: number | null;
  newAllTimeBest: boolean;
  submissionCount: number;
  scoredCount: number;
  failedOrPendingCount: number;
  meanScore: number | null;
  medianScore: number | null;
  scoreStdDev: number | null;
  cumulativeBest: number | null;
};

export type ArcAgi3DailyRecord = {
  schemaVersion: number;
  project: string;
  competition: string;
  date: string;
  timezone: string;
  generatedAt: string;
  dailySummary?: string;
  submissions: ArcAgi3PageSubmission[];
  scoreSummary: ArcAgi3PageScoreSummary;
  scoreMovementReason?: string;
  conceptsImplemented?: ArcAgi3PageConcept[];
  hypotheses: ArcAgi3PageHypothesis[];
  experiments?: {
    id: string;
    strategy?: string;
    configSummary?: string;
    submissionRefs?: string[];
  }[];
  results?: {
    facts?: string[];
    whatWorked?: string[];
    whatDidNotWork?: string[];
  };
  analysis?: {
    facts?: string[];
    interpretations?: string[];
    limitations?: string[];
    nextSteps?: string[];
  };
  githubActivity?: {
    commits?: { sha: string; message: string; timestamp?: string }[];
    changedFiles?: string[];
    note?: string;
  };
  warnings?: string[];
};

export type ArcAgi3ScorePoint = {
  date: string;
  timestamp: string;
  submissionRef: string;
  score: number;
  status: string;
  description?: string;
  cumulativeBest: number;
  isAllTimeBest?: boolean;
};

export type ArcAgi3ScoreHistory = {
  schemaVersion: number;
  points: ArcAgi3ScorePoint[];
  bestPublicScore: number | null;
  bestScoreDate: string | null;
  latestPublicScore: number | null;
  latestScoreDate: string | null;
  totalSubmissions: number;
  experimentDays: number;
  updatedAt?: string;
};

export type ArcAgi3ProjectPageConfig = {
  title: string;
  description: string;
  competitionUrl: string;
  githubUrl: string;
  activeResearchQuestions?: string[];
  currentBestApproach?: string;
  asraNfmConcepts?: ArcAgi3PageConcept[];
};

export function loadArcAgi3ProjectPageConfig(): ArcAgi3ProjectPageConfig {
  const cfg = readJsonFile<ArcAgi3ProjectPageConfig>(
    path.join(PROJECT_PAGE_DIR, "config.json"),
  );
  return (
    cfg ?? {
      title: "ARC-AGI-3 Research Agent",
      description:
        "Autonomous ASRA-aligned research loop for ARC Prize 2026.",
      competitionUrl:
        "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
      githubUrl:
        "https://github.com/ilakkmanoharan/ilakk-manoharan/tree/main/arc-agi-3-research",
    }
  );
}

export function loadArcAgi3ScoreHistory(): ArcAgi3ScoreHistory {
  return (
    readJsonFile<ArcAgi3ScoreHistory>(
      path.join(PROJECT_PAGE_DIR, "score-history.json"),
    ) ?? {
      schemaVersion: 1,
      points: [],
      bestPublicScore: null,
      bestScoreDate: null,
      latestPublicScore: null,
      latestScoreDate: null,
      totalSubmissions: 0,
      experimentDays: 0,
    }
  );
}

export function listArcAgi3DayDates(): string[] {
  const dir = path.join(PROJECT_PAGE_DIR, "daily");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadArcAgi3Day(date: string): ArcAgi3DailyRecord | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return readJsonFile<ArcAgi3DailyRecord>(
    path.join(PROJECT_PAGE_DIR, "daily", `${date}.json`),
  );
}

export function formatArcPageScore(
  score: number | null | undefined,
  digits = 4,
): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "Not recorded";
  }
  return score.toFixed(digits);
}

export function formatArcScoreDelta(
  delta: number | null | undefined,
  digits = 4,
): string {
  if (delta === null || delta === undefined || Number.isNaN(delta)) {
    return "Not recorded";
  }
  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(digits)}`;
}

export function hypothesisStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}
