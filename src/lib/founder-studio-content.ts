import { loadFounderStudioFromMarkdown } from "../../prisma/load-founder-studio-from-md";

/** Founder Studio card shape for pages — sourced from content/founder-studio/*.md (not Turso). */
export type DisplayFounderStudioItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  youtubeId: string | null;
  summary: string;
  transcript: string;
  relatedProjectSlug: string | null;
  relatedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
};

export function loadFounderStudioForPage(
  cwd = process.cwd(),
): DisplayFounderStudioItem[] {
  const now = new Date();
  return loadFounderStudioFromMarkdown(cwd).map((item) => ({
    id: item.slug,
    slug: item.slug,
    title: item.title,
    category: item.category,
    youtubeId: item.youtubeId,
    summary: item.summary,
    transcript: item.transcript,
    relatedProjectSlug: item.relatedProjectSlug,
    relatedSkills: item.relatedSkills,
    createdAt: now,
    updatedAt: now,
  }));
}
