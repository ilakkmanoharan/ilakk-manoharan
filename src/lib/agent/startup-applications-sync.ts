import fs from "node:fs";
import path from "node:path";
import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";

const SITE = "https://ilakk-manoharan.vercel.app";

export type NotebookMarkdownSource = {
  dir: string;
  /** claim id prefix, e.g. startup-app | notebook-applied */
  kind: string;
  /** node title prefix */
  label: string;
  /** default source URL on portfolio */
  sourceUrl?: string;
  topics?: string[];
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
    origin: "page",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

/** Ingest markdown files from external notebook folders (startup-applications, applied, etc.). */
export function buildNotebookMarkdownClaims(source: NotebookMarkdownSource): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const { dir, kind, label } = source;

  if (!dir || !fs.existsSync(dir)) {
    return { claims, nodes };
  }

  const url = source.sourceUrl ?? `${SITE}/startups`;
  const baseTopics = source.topics ?? [kind.replace(/-/g, " "), "notebook"];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("README"))
    .sort();

  for (const file of files) {
    const filePath = path.join(dir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const slug = slugify(path.basename(file, ".md"));
    const claimIds: string[] = [];

    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1]?.trim() ?? slug.replace(/-/g, " ");

    const summaryId = `claim-auto-${kind}-${slug}-file`;
    claims.push(
      makeClaim(
        summaryId,
        `${label} (${title}): ${stripMarkdown(raw.slice(0, 500))}`,
        [title, slug, ...baseTopics],
        [url, filePath],
      ),
    );
    claimIds.push(summaryId);

    for (const [i, para] of splitParagraphs(raw).entries()) {
      const id = `claim-auto-${kind}-${slug}-p${i + 1}`;
      claims.push(
        makeClaim(id, para, [title, slug, ...baseTopics], [url, filePath]),
      );
      claimIds.push(id);
    }

    nodes.push({
      id: `node-${kind}-${slug}`,
      type: "page",
      title: `${label}: ${title}`,
      url,
      claimIds,
    });
  }

  return { claims, nodes };
}

/** @deprecated use buildNotebookMarkdownClaims */
export function buildStartupApplicationClaims(applicationsDir: string) {
  return buildNotebookMarkdownClaims({
    dir: applicationsDir,
    kind: "startup-app",
    label: "Startup application",
    sourceUrl: `${SITE}/startups`,
    topics: ["startup application", "accelerator", "founder"],
  });
}

export function buildNotebookExternalClaims(options: {
  startupApplicationsDir?: string;
  appliedDir?: string;
}): { claims: AgentClaim[]; nodes: KnowledgeNode[] } {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];

  const sources: NotebookMarkdownSource[] = [];
  if (options.startupApplicationsDir) {
    sources.push({
      dir: options.startupApplicationsDir,
      kind: "startup-app",
      label: "Startup application",
      sourceUrl: `${SITE}/startups`,
      topics: ["startup application", "accelerator", "founder"],
    });
  }
  if (options.appliedDir) {
    sources.push({
      dir: options.appliedDir,
      kind: "notebook-applied",
      label: "Application",
      sourceUrl: `${SITE}/exceptional-ability`,
      topics: ["application", "fellowship", "accelerator"],
    });
  }

  for (const src of sources) {
    const batch = buildNotebookMarkdownClaims(src);
    claims.push(...batch.claims);
    nodes.push(...batch.nodes);
  }

  return { claims, nodes };
}
