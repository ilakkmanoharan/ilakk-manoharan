import fs from "node:fs";
import path from "node:path";

export type OpenSourceContributionItem = {
  number: number;
  kind: "pull" | "issue";
  title: string;
  state: "open" | "closed" | "merged";
  url: string;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  contribution: string;
  detail: string;
};

export type OpenSourceOrgContribution = {
  slug: string;
  name: string;
  repo: string;
  repoUrl: string;
  projectPageUrl: string;
  blurb: string;
  focus: string;
  syncedAt: string;
  items: OpenSourceContributionItem[];
};

export function loadLiveKitContributions(
  cwd = process.cwd(),
): OpenSourceOrgContribution | null {
  const file = path.join(
    cwd,
    "content",
    "open-source",
    "livekit-contributions.json",
  );
  if (!fs.existsSync(file)) return null;
  return JSON.parse(
    fs.readFileSync(file, "utf8"),
  ) as OpenSourceOrgContribution;
}

export function loadOpenSourceContributions(
  cwd = process.cwd(),
): OpenSourceOrgContribution[] {
  const livekit = loadLiveKitContributions(cwd);
  return livekit ? [livekit] : [];
}

export function statusLabel(state: OpenSourceContributionItem["state"]): string {
  if (state === "merged") return "Merged";
  if (state === "open") return "Open; awaiting review";
  return "Closed";
}
