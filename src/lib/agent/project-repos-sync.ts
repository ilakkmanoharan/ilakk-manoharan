import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadProjectsFromMarkdown } from "../../../prisma/load-projects-from-md";
import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";

const SITE = "https://ilakk-manoharan.vercel.app";
const TEXT_EXTENSIONS = new Set([".md", ".txt", ".markdown"]);

/** Repos outside PROJECTS_ROOT (sibling to home or custom layout). */
const KNOWN_REPO_PATHS: Record<string, string[]> = {
  "orbit-wars": ["orbit-wars"],
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "doc";
}

function stripMarkdown(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => stripMarkdown(p))
    .filter((p) => p.length > 40);
}

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
    origin: "project",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

function repoNameFromGithubUrl(githubUrl: string | null): string | null {
  if (!githubUrl?.trim()) return null;
  const m = githubUrl.match(/github\.com\/[^/]+\/([^/?#]+)/i);
  if (!m) return null;
  return m[1].replace(/\.git$/i, "");
}

function projectRoots(cwd: string): string[] {
  const roots = new Set<string>();
  const envRoot = process.env.PROJECTS_ROOT?.trim();
  if (envRoot) roots.add(path.resolve(envRoot));
  roots.add(path.resolve(cwd, ".."));
  roots.add(path.join(os.homedir(), "Projects"));
  return [...roots];
}

export function resolveLocalProjectRepo(
  repoName: string,
  cwd = process.cwd(),
): string | null {
  for (const root of projectRoots(cwd)) {
    const direct = path.join(root, repoName);
    if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) {
      return direct;
    }
    try {
      for (const entry of fs.readdirSync(root)) {
        if (entry.toLowerCase() === repoName.toLowerCase()) {
          const full = path.join(root, entry);
          if (fs.statSync(full).isDirectory()) return full;
        }
      }
    } catch {
      /* root missing */
    }
  }

  for (const rel of KNOWN_REPO_PATHS[repoName] ?? []) {
    const homePath = path.join(os.homedir(), rel);
    if (fs.existsSync(homePath) && fs.statSync(homePath).isDirectory()) {
      return homePath;
    }
  }

  return null;
}

function shouldIndexFile(rel: string) {
  const base = path.basename(rel).toLowerCase();
  if (base === "readme.md" || base === "paper.md") return true;
  if (rel.includes("/docs/") && base.endsWith(".md")) return true;
  if (/phase\d+\/paper\.md$/i.test(rel.replace(/\\/g, "/"))) return true;
  if (rel.includes("/private/marketing/") && base.endsWith(".md")) return true;
  return false;
}

function collectIndexableFiles(root: string, out: string[] = [], prefix = "") {
  if (!fs.existsSync(root)) return out;
  const stat = fs.statSync(root);
  if (stat.isFile()) {
    if (TEXT_EXTENSIONS.has(path.extname(root).toLowerCase()) && shouldIndexFile(prefix || path.basename(root))) {
      out.push(root);
    }
    return out;
  }

  for (const entry of fs.readdirSync(root).sort()) {
    if (entry.startsWith(".") || entry === "node_modules" || entry === ".venv" || entry === "venv") {
      continue;
    }
    const full = path.join(root, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      collectIndexableFiles(full, out, rel);
    } else if (
      TEXT_EXTENSIONS.has(path.extname(entry).toLowerCase()) &&
      shouldIndexFile(rel)
    ) {
      out.push(full);
    }
  }
  return out;
}

/** Ingest markdown from local project repos listed on /projects. */
export function buildProjectRepoClaims(cwd = process.cwd()): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
  indexed: { slug: string; repoPath: string; fileCount: number }[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const indexed: { slug: string; repoPath: string; fileCount: number }[] = [];

  for (const project of loadProjectsFromMarkdown(cwd)) {
    const repoName = repoNameFromGithubUrl(project.githubUrl);
    if (!repoName) continue;

    const repoPath = resolveLocalProjectRepo(repoName, cwd);
    if (!repoPath) continue;

    const files = collectIndexableFiles(repoPath);
    if (files.length === 0) continue;

    indexed.push({ slug: project.slug, repoPath, fileCount: files.length });
    const pageUrl = `${SITE}/projects`;
    const claimIds: string[] = [];

    const summaryId = `claim-auto-project-repo-${project.slug}-summary`;
    claims.push(
      makeClaim(
        summaryId,
        `${project.title} (local repo ${repoName}): ${project.description}`,
        [project.title, project.slug, repoName, ...project.filterTags],
        [pageUrl, project.githubUrl ?? pageUrl, project.websiteUrl ?? pageUrl].filter(
          Boolean,
        ) as string[],
      ),
    );
    claimIds.push(summaryId);

    for (const filePath of files) {
      const rel = path.relative(repoPath, filePath);
      const relSlug = slugify(`${project.slug}-${rel}`);
      const raw = fs.readFileSync(filePath, "utf8");
      const title =
        raw.match(/^#\s+(.+)/m)?.[1]?.trim() ??
        rel.replace(/[/\\]/g, " · ");

      for (const [i, para] of splitParagraphs(raw).entries()) {
        const id = `claim-auto-project-repo-${relSlug}-p${i + 1}`;
        claims.push(
          makeClaim(
            id,
            `${project.title} — ${title}: ${para}`,
            [project.title, project.slug, repoName, ...project.filterTags, "project repo"],
            [project.githubUrl ?? pageUrl, pageUrl],
          ),
        );
        claimIds.push(id);
      }
    }

    nodes.push({
      id: `node-project-repo-${project.slug}`,
      type: "project",
      title: `${project.title} (local repo)`,
      url: pageUrl,
      claimIds,
    });
  }

  return { claims, nodes, indexed };
}
