import fs from "node:fs";
import path from "node:path";

export const CASMI_KAGGLE =
  "https://www.kaggle.com/competitions/enveda-CASMI26-molecule-id-mass-spectra";
export const CASMI_GITHUB =
  "https://github.com/ilakkmanoharan/casmi26-structure-prediction";

const RESEARCH_DIR = path.join(
  process.cwd(),
  "casmi26-structure-prediction-research",
  "research",
);

export type CasmiSubmission = {
  ref: string;
  timestamp: string;
  fileName?: string;
  description?: string;
  status: string;
  publicScore: number | null;
  privateScore?: number | null;
  strategy?: string;
};

export type CasmiHypothesis = {
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

export type CasmiConcept = {
  name: string;
  why?: string;
  how?: string;
};

export type CasmiScoreSummary = {
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

export type CasmiDailyRecord = {
  schemaVersion: number;
  project: string;
  competition: string;
  date: string;
  timezone: string;
  generatedAt: string;
  dailySummary?: string;
  submissions: CasmiSubmission[];
  scoreSummary: CasmiScoreSummary;
  conceptsImplemented?: CasmiConcept[];
  research?: { id: string; title: string; summary: string; source?: string }[];
  hypotheses: CasmiHypothesis[];
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

export type CasmiScorePoint = {
  date: string;
  timestamp: string;
  submissionRef: string;
  score: number;
  status: string;
  description?: string;
  cumulativeBest: number;
  isAllTimeBest?: boolean;
};

export type CasmiScoreHistory = {
  schemaVersion: number;
  points: CasmiScorePoint[];
  bestPublicScore: number | null;
  bestScoreDate: string | null;
  latestPublicScore: number | null;
  latestScoreDate: string | null;
  totalSubmissions: number;
  experimentDays: number;
  updatedAt?: string;
};

export type CasmiProjectConfig = {
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

export function loadCasmiConfig(): CasmiProjectConfig {
  const cfg = readJsonFile<CasmiProjectConfig>(
    path.join(RESEARCH_DIR, "config.json"),
  );
  return (
    cfg ?? {
      title: "Enveda CASMI 2026",
      description:
        "Neuro-symbolic system for identifying molecular structures from mass spectra.",
      competitionUrl: CASMI_KAGGLE,
      githubUrl: CASMI_GITHUB,
    }
  );
}

export function loadCasmiScoreHistory(): CasmiScoreHistory {
  return (
    readJsonFile<CasmiScoreHistory>(
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

export function listCasmiDayDates(): string[] {
  const dir = path.join(RESEARCH_DIR, "daily");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
}

export function loadCasmiDay(date: string): CasmiDailyRecord | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return readJsonFile<CasmiDailyRecord>(
    path.join(RESEARCH_DIR, "daily", `${date}.json`),
  );
}

export function formatCasmiScore(
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
