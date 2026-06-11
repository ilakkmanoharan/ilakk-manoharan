import { loadProjectsFromMarkdown } from "../../prisma/load-projects-from-md";

/** Project card shape for pages — sourced from content/projects/*.md (not Turso). */
export type DisplayProject = {
  id: string;
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  role: string;
  status: string;
  githubUrl: string | null;
  websiteUrl: string | null;
  appStoreUrl: string | null;
  demoVideoUrl: string | null;
  caseStudyUrl: string | null;
  filterTags: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function loadProjectsForPage(cwd = process.cwd()): DisplayProject[] {
  const now = new Date();
  const rows = loadProjectsFromMarkdown(cwd).map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.title,
    description: p.description,
    techStack: p.techStack,
    role: p.role,
    status: p.status,
    githubUrl: p.githubUrl,
    websiteUrl: p.websiteUrl,
    appStoreUrl: p.appStoreUrl,
    demoVideoUrl: p.demoVideoUrl,
    caseStudyUrl: p.caseStudyUrl,
    filterTags: p.filterTags,
    featured: p.featured,
    createdAt: now,
    updatedAt: now,
  }));
  return rows.sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.title.localeCompare(b.title),
  );
}
