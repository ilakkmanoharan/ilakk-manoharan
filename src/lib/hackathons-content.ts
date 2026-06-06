import { loadHackathonsFromMarkdown } from "../../prisma/load-hackathons-from-md";

/** Hackathon card shape for pages — sourced from content/hackathons/*.md (not Turso). */
export type DisplayHackathon = {
  id: string;
  slug: string;
  hackathonName: string;
  projectName: string;
  problemAddressed: string;
  solutionSummary: string;
  datasetUsed: string | null;
  modelTech: string | null;
  technicalContribution: string;
  impact: string;
  githubUrl: string | null;
  kaggleUrl: string | null;
  demoVideo: string | null;
  writeupLink: string | null;
  statusResult: string;
  createdAt: Date;
  updatedAt: Date;
};

export function loadHackathonsForPage(cwd = process.cwd()): DisplayHackathon[] {
  const now = new Date();
  return loadHackathonsFromMarkdown(cwd).map((h) => ({
    id: h.slug,
    slug: h.slug,
    hackathonName: h.hackathonName,
    projectName: h.projectName,
    problemAddressed: h.problemAddressed,
    solutionSummary: h.solutionSummary,
    datasetUsed: h.datasetUsed,
    modelTech: h.modelTech,
    technicalContribution: h.technicalContribution,
    impact: h.impact,
    githubUrl: h.githubUrl,
    kaggleUrl: h.kaggleUrl,
    demoVideo: h.demoVideo,
    writeupLink: h.writeupLink,
    statusResult: h.statusResult,
    createdAt: now,
    updatedAt: now,
  }));
}
