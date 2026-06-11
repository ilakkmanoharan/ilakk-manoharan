import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";
import {
  buildSkillsProjectIndex,
  listAllSkillLabels,
} from "@/lib/project-skills-index";

const SITE = "https://ilakk-manoharan.vercel.app";
const PAGE_URL = `${SITE}/skills/projects`;

function makeClaim(
  id: string,
  text: string,
  topics: string[],
  sources: string[],
): AgentClaim {
  return {
    id,
    text,
    topics: [...new Set(topics.map((t) => t.toLowerCase()))],
    sources: [...new Set(sources)],
    origin: "skill",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

/** Knowledge-graph claims: skills ↔ projects index for recruiter/agent RAG. */
export function buildProjectSkillsClaims(cwd = process.cwd()): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const index = buildSkillsProjectIndex(cwd);
  const claimIds: string[] = [];

  const overviewId = "claim-auto-skills-projects-overview";
  claims.push(
    makeClaim(
      overviewId,
      `Ilak Manoharan's portfolio maps ${index.skillCount} technical skills to ${index.projectCount} shipped projects. For any skill (e.g. Machine Learning, Backend, Python, Cloud/AWS, TypeScript, Scientific AI), you can list projects that demonstrate that skill. Full index: ${PAGE_URL}`,
      ["skills", "projects", "portfolio", "ilak", "capabilities"],
      [PAGE_URL, `${SITE}/skills`, `${SITE}/projects`],
    ),
  );
  claimIds.push(overviewId);

  for (const group of index.skills) {
    const projectNames = group.projects.map((p) => p.title).join(", ");
    const skillTopics = [
      group.skillLabel,
      group.skillId,
      group.category,
      "skills",
      "projects",
      ...group.skillLabel.split(/\s+/),
    ];

    const hasSkillId = `claim-auto-skill-has-${group.skillId}`;
    const years =
      group.yearsExperience != null
        ? ` (${group.yearsExperience}+ years on the skills page)`
        : "";
    claims.push(
      makeClaim(
        hasSkillId,
        `Yes — Ilak has ${group.skillLabel} skill${years}. Demonstrated in projects: ${projectNames}.`,
        skillTopics,
        [PAGE_URL, group.skillPageUrl, `${SITE}/projects`],
      ),
    );
    claimIds.push(hasSkillId);

    const listId = `claim-auto-skill-projects-${group.skillId}`;
    claims.push(
      makeClaim(
        listId,
        `Projects involving ${group.skillLabel}: ${group.projects
          .map(
            (p) =>
              `${p.title} (${p.status}; evidence: ${p.evidence.slice(0, 3).join(", ")})`,
          )
          .join("; ")}.`,
        skillTopics,
        [PAGE_URL, `${SITE}/projects`],
      ),
    );
    claimIds.push(listId);

    for (const project of group.projects) {
      const edgeId = `claim-auto-skill-edge-${group.skillId}-${project.slug}`;
      claims.push(
        makeClaim(
          edgeId,
          `Project "${project.title}" demonstrates Ilak's ${group.skillLabel} skill (${project.evidence.join("; ")}).`,
          [group.skillLabel, project.title, project.slug, "project skill"],
          [PAGE_URL, project.projectUrl, `${SITE}/projects`],
        ),
      );
      claimIds.push(edgeId);
    }
  }

  for (const { id, label, aliases } of listAllSkillLabels()) {
    const aliasId = `claim-auto-skill-alias-${id}`;
    claims.push(
      makeClaim(
        aliasId,
        `Skill query aliases for ${label}: ${aliases.join(", ")}. Ask "Does Ilak have ${label}?" or "Projects involving ${label}" — see ${PAGE_URL}.`,
        [label, id, "skill alias", "skills"],
        [PAGE_URL],
      ),
    );
    claimIds.push(aliasId);
  }

  nodes.push({
    id: "node-skills-projects-index",
    type: "skill",
    title: "Projects by skill",
    url: PAGE_URL,
    claimIds,
  });

  return { claims, nodes };
}
