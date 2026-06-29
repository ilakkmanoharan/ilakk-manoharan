import fs from "node:fs";
import path from "node:path";

export type NeurogolfTimelinePoint = {
  label: string;
  date: string;
  submission: number;
  kaggle: number;
  pass_all: number;
  est: number;
};

export type NeurogolfAdapterStats = {
  display: string;
  examples: number;
  mlx_train_rows: number;
  checkpoint: boolean;
  base_model: string;
};

export type NeurogolfSubmissionDetail = {
  label: string;
  date: string;
  submission: number;
  milestone: string | null;
  phase: number | null;
  pass_all: number | null;
  kaggle_eligible: number | null;
  train_only: number | null;
  oversized_pass_all: number | null;
  kaggle_actual: number | null;
  kaggle_est: number | null;
  kaggle_delta: number | null;
  audit_ratio: number | null;
  outcome: string;
  submitted: boolean;
  submitted_at: string | null;
  submitted_by: string | null;
  message: string;
  onnx_count: number | null;
  new_tasks: number[] | null;
  solver_counts: Record<string, number> | null;
  arcgen_validate_samples: number | null;
  elapsed_s: number | null;
  audit_buckets: Record<string, number> | null;
  docs: Record<string, string>;
};

export type NeurogolfLoraStats = {
  generated_at: string;
  competition: string;
  goal: string;
  best_kaggle: number | null;
  best_pass_all: number | null;
  best_label: string | null;
  timeline: NeurogolfTimelinePoint[];
  submissions: NeurogolfSubmissionDetail[];
  outcomes: Record<string, number>;
  adapters: Record<string, NeurogolfAdapterStats>;
  note_arcgen: string;
};

const STATS_PATH = path.join(
  process.cwd(),
  "content",
  "neurogolf",
  "lora-stats.json",
);

export function loadNeurogolfLoraStats(): NeurogolfLoraStats {
  const raw = fs.readFileSync(STATS_PATH, "utf8");
  return JSON.parse(raw) as NeurogolfLoraStats;
}

export const NEUROGOLF_GITHUB =
  "https://github.com/ilakkmanoharan/ARC-NeuroGolf";
export const NEUROGOLF_KAGGLE =
  "https://www.kaggle.com/competitions/neurogolf-2026";
export const NEUROGOLF_LORA_RESEARCH_REPO =
  "https://github.com/ilakkmanoharan/ARC-NeuroGolf/tree/main/kaggle-submissions/research/lora";
