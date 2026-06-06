import {
  loadSkillsFromMarkdown,
  type SkillExperienceSeed,
} from "../../prisma/load-skills-from-md";

/** Skill card shape for pages — sourced from content/skills/*.md (not Turso). */
export type DisplaySkillExperience = SkillExperienceSeed & { id: string };

export type DisplaySkill = {
  id: string;
  slug: string;
  name: string;
  category: string;
  overview: string;
  yearsExperience: number;
  tools: string[];
  examples: string[];
  videoUrls: string[];
  githubLinks: string[];
  experiences: DisplaySkillExperience[];
  body: string;
  createdAt: Date;
  updatedAt: Date;
};

export function loadSkillsForPage(cwd = process.cwd()): DisplaySkill[] {
  const now = new Date();
  return loadSkillsFromMarkdown(cwd).map((skill) => ({
    id: skill.slug,
    slug: skill.slug,
    name: skill.name,
    category: skill.category,
    overview: skill.overview,
    yearsExperience: skill.yearsExperience,
    tools: skill.tools,
    examples: skill.examples,
    videoUrls: skill.videoUrls,
    githubLinks: skill.githubLinks,
    experiences: skill.experiences.map((ex, i) => ({
      ...ex,
      id: `${skill.slug}-exp-${i + 1}`,
    })),
    body: skill.body,
    createdAt: now,
    updatedAt: now,
  }));
}

export function loadSkillBySlug(
  slug: string,
  cwd = process.cwd(),
): DisplaySkill | null {
  return loadSkillsForPage(cwd).find((s) => s.slug === slug) ?? null;
}
