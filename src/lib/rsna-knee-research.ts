import fs from "node:fs";
import path from "node:path";

export const RSNA_KAGGLE =
  "https://www.kaggle.com/competitions/rsna-knee-abnormality-detection";
export const RSNA_GITHUB =
  "https://github.com/ilakkmanoharan/rsna-knee-mri-classifier";

const RESEARCH_DIR = path.join(
  process.cwd(),
  "rsna-knee-mri-classifier-research",
  "research",
);

export type RsnaSubmission = {
  ref: string;
  timestamp: string;
  fileName?: string;
  description?: string;
  status: string;
  publicScore: number | null;
  privateScore?: number | null;
  strategy?: string;
};

export type RsnaHypothesis = {
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

export type RsnaConcept = {
  name: string;
  why?: string;
  how?: string;
};

export type RsnaScoreSummary = {
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
  consecutiveImprovementCount?: number | null;
  daysSincePreviousAllTimeBest?: number | null;
};

export type RsnaDailyRecord = {
  schemaVersion: number;
  project: string;
  competition: string;
  date: string;
  timezone: string;
  generatedAt: string;
  dailySummary?: string;
  submissions: RsnaSubmission[];
  scoreSummary: RsnaScoreSummary;
  conceptsImplemented?: RsnaConcept[];
  research?: { id: string; title: string; summary: string; source?: string }[];
  hypotheses: RsnaHypothesis[];
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

export type RsnaScorePoint = {
  date: string;
  timestamp: string;
  submissionRef: string;
  score: number;
  status: string;
  description?: string;
  cumulativeBest: number;
  isAllTimeBest?: boolean;
};

export type RsnaScoreHistory = {
  schemaVersion: number;
  points: RsnaScorePoint[];
  bestPublicScore: number | null;
  bestScoreDate: string | null;
  latestPublicScore: number | null;
  latestScoreDate: string | null;
  totalSubmissions: number;
  experimentDays: number;
  updatedAt?: string;
};

export type RsnaProjectConfig = {
  title: string;
  description: string;
  competitionUrl: string;
  githubUrl: string;
  activeResearchQuestions?: string[];
  currentBestApproach?: string;
};

function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

export function loadRsnaConfig(): RsnaProjectConfig {
  const cfg = readJsonFile<RsnaProjectConfig>(
    path.join(RESEARCH_DIR, "config.json"),
  );
  return (
    cfg ?? {
      title: "RSNA Knee MRI Classifier",
      description:
        "Deep-learning system for detecting knee abnormalities from MRI exams.",
      competitionUrl: RSNA_KAGGLE,
      githubUrl: RSNA_GITHUB,
    }
  );
}

export function loadRsnaScoreHistory(): RsnaScoreHistory {
  return (
    readJsonFile<RsnaScoreHistory>(
      path.join(RESEARCH_DIR, "score-history.json"),
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

export function listRsnaDayDates(): string[] {
  const dir = path.join(RESEARCH_DIR, "daily");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadRsnaDay(date: string): RsnaDailyRecord | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return readJsonFile<RsnaDailyRecord>(
    path.join(RESEARCH_DIR, "daily", `${date}.json`),
  );
}

export function formatRsnaScore(
  score: number | null | undefined,
  digits = 4,
): string {
  if (score === null || score === undefined || Number.isNaN(score)) {
    return "Not recorded";
  }
  return score.toFixed(digits);
}

export function formatScoreDelta(
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
