import { loadExperienceFromMarkdown } from "../../prisma/load-experience-from-md";
import type { DisplayProject } from "@/lib/projects-content";

/** Professional experience cards — sourced from content/experience/*.md */
export function loadExperienceForPage(cwd = process.cwd()): DisplayProject[] {
  const now = new Date();
  return loadExperienceFromMarkdown(cwd).map((e) => ({
    id: e.slug,
    slug: e.slug,
    title: e.title,
    description: e.description,
    techStack: e.techStack,
    role: e.role,
    status: e.status,
    githubUrl: e.githubUrl,
    websiteUrl: e.websiteUrl,
    appStoreUrl: e.appStoreUrl,
    demoVideoUrl: e.demoVideoUrl,
    caseStudyUrl: e.caseStudyUrl,
    relatedLinks: e.relatedLinks,
    filterTags: e.filterTags,
    featured: e.featured,
    createdAt: now,
    updatedAt: now,
  }));
}
