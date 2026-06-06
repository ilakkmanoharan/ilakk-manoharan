import { loadStartupsFromMarkdown } from "../../prisma/load-startups-from-md";

/** Startup card shape for pages — sourced from content/startups/*.md (not Turso). */
export type DisplayStartup = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  targetUsers: string;
  status: string;
  websiteUrl: string | null;
  githubUrl: string | null;
  youtubeUrl: string | null;
  pitchDeckUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function loadStartupsForPage(cwd = process.cwd()): DisplayStartup[] {
  const now = new Date();
  return loadStartupsFromMarkdown(cwd).map((s) => ({
    id: s.slug,
    slug: s.slug,
    name: s.name,
    tagline: s.tagline,
    description: s.description,
    problem: s.problem,
    solution: s.solution,
    targetUsers: s.targetUsers,
    status: s.status,
    websiteUrl: s.websiteUrl,
    githubUrl: s.githubUrl,
    youtubeUrl: s.youtubeUrl,
    pitchDeckUrl: s.pitchDeckUrl,
    createdAt: now,
    updatedAt: now,
  }));
}
