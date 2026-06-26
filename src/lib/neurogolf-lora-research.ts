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

export type NeurogolfLoraStats = {
  generated_at: string;
  competition: string;
  goal: string;
  best_kaggle: number | null;
  best_pass_all: number | null;
  best_label: string | null;
  timeline: NeurogolfTimelinePoint[];
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
