import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";

const SITE = "https://ilakk-manoharan.vercel.app";
const NFM_REPO = "https://github.com/ilakkmanoharan/Nature-Foundation-Models";

/** Explicit files under Nature-Foundation-Models/private/ to index. */
const NFM_PRIVATE_FILES = [
  "private/marketing/project-desc.md",
  "private/paper/NFM-framework-v2.md",
] as const;

/** Directories under private/ — markdown pitch decks and HTML posters. */
const NFM_PRIVATE_DIRS: { rel: string; extensions: Set<string> }[] = [
  { rel: "private/pitch-decks", extensions: new Set([".md"]) },
  { rel: "private/posters", extensions: new Set([".html"]) },
];

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".venv",
  "venv",
  "__pycache__",
]);

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

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
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
    origin: "private",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

function repoRoots(cwd: string): string[] {
  const roots = new Set<string>();
  const envRoot = process.env.PROJECTS_ROOT?.trim();
  if (envRoot) roots.add(path.resolve(envRoot));
  roots.add(path.resolve(cwd, ".."));
  roots.add(path.join(os.homedir(), "Projects"));
  return [...roots];
}

/** Resolve local Nature-Foundation-Models repo (sibling or ~/Projects). */
export function resolveNfmRepoDir(cwd = process.cwd()): string | undefined {
  const env = process.env.NFM_REPO_DIR?.trim() ?? process.env.NFM_PRIVATE_DIR?.trim();
  if (env) {
    const resolved = path.resolve(env);
    if (fs.existsSync(resolved)) return resolved;
  }

  for (const root of repoRoots(cwd)) {
    const direct = path.join(root, "Nature-Foundation-Models");
    if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) {
      return direct;
    }
  }

  const homePath = path.join(os.homedir(), "Projects", "Nature-Foundation-Models");
  if (fs.existsSync(homePath)) return homePath;

  return undefined;
}

function collectDirFiles(
  root: string,
  extensions: Set<string>,
  out: string[] = [],
  prefix = "",
) {
  if (!fs.existsSync(root)) return out;

  for (const entry of fs.readdirSync(root).sort()) {
    if (entry.startsWith(".") || SKIP_DIR_NAMES.has(entry)) continue;
    const full = path.join(root, entry);
    const rel = prefix ? `${prefix}/${entry}` : entry;
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      collectDirFiles(full, extensions, out, rel);
    } else if (extensions.has(path.extname(entry).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function readIndexedText(filePath: string): string {
  const raw = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".html") return stripHtml(raw);
  return raw;
}

export type NfmPrivateIndexedFile = {
  rel: string;
  abs: string;
};

export function listNfmPrivateIndexedFiles(repoDir: string): NfmPrivateIndexedFile[] {
  const out: NfmPrivateIndexedFile[] = [];

  for (const rel of NFM_PRIVATE_FILES) {
    const abs = path.join(repoDir, rel);
    if (fs.existsSync(abs)) out.push({ rel, abs });
  }

  for (const dir of NFM_PRIVATE_DIRS) {
    const absDir = path.join(repoDir, dir.rel);
    for (const abs of collectDirFiles(absDir, dir.extensions)) {
      out.push({ rel: path.relative(repoDir, abs), abs });
    }
  }

  return out;
}

/** Paths to watch for NFM private content changes (local dev). */
export function listNfmPrivateWatchPaths(cwd = process.cwd()): string[] {
  const repo = resolveNfmRepoDir(cwd);
  if (!repo) return [];

  const paths: string[] = [];
  for (const rel of NFM_PRIVATE_FILES) {
    const abs = path.join(repo, rel);
    if (fs.existsSync(abs)) paths.push(abs);
  }
  for (const dir of NFM_PRIVATE_DIRS) {
    const absDir = path.join(repo, dir.rel);
    if (fs.existsSync(absDir)) paths.push(absDir);
  }
  return paths;
}

/** Ingest NFM private marketing, framework paper, pitch decks, and posters. */
export function buildNfmPrivateClaims(repoDir: string): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
  indexed: NfmPrivateIndexedFile[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const indexed = listNfmPrivateIndexedFiles(repoDir);
  if (indexed.length === 0) return { claims, nodes, indexed };

  const pageUrl = `${SITE}/nfm`;
  const baseTopics = [
    "Nature Foundation Models",
    "NFM",
    "Atlas-GS",
    "ASRA",
    "Decision Biology",
    "scientific AI",
  ];
  const claimIds: string[] = [];

  const summaryId = "claim-auto-nfm-private-corpus-summary";
  claims.push(
    makeClaim(
      summaryId,
      `Nature Foundation Models private corpus (${indexed.length} file(s)): project description, NFM framework v2 paper, pitch decks, and posters from the local Nature-Foundation-Models repository.`,
      [...baseTopics, "pitch", "poster", "framework"],
      [pageUrl, NFM_REPO],
    ),
  );
  claimIds.push(summaryId);

  for (const { rel, abs } of indexed) {
    const relSlug = slugify(rel.replace(/[/\\]/g, "-").replace(/\.[^.]+$/, ""));
    const raw = readIndexedText(abs);
    const ext = path.extname(abs).toLowerCase();
    const sources = [
      pageUrl,
      NFM_REPO,
      `nfm-private://${rel.replace(/\\/g, "/")}`,
    ];

    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title =
      titleMatch?.[1]?.trim() ??
      path.basename(abs, ext).replace(/-/g, " ");

    const kind =
      rel.includes("/pitch-decks/") ? "pitch deck"
      : rel.includes("/posters/") ? "poster"
      : rel.includes("/paper/") ? "framework paper"
      : "marketing";

    const summaryFileId = `claim-auto-nfm-private-${relSlug}-file`;
    const preview = ext === ".html" ? raw.slice(0, 800) : raw.slice(0, 500);
    claims.push(
      makeClaim(
        summaryFileId,
        `NFM ${kind} (${title}): ${stripMarkdown(preview)}`,
        [title, relSlug, kind, ...baseTopics],
        sources,
      ),
    );
    claimIds.push(summaryFileId);

    const paragraphs =
      ext === ".html"
        ? stripHtml(raw)
            .split(/(?<=[.!?])\s+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 40)
        : splitParagraphs(raw);

    for (const [i, para] of paragraphs.entries()) {
      const id = `claim-auto-nfm-private-${relSlug}-p${i + 1}`;
      claims.push(
        makeClaim(id, `${title}: ${para}`, [title, relSlug, kind, ...baseTopics], sources),
      );
      claimIds.push(id);
    }
  }

  nodes.push({
    id: "node-nfm-private-corpus",
    type: "page",
    title: "Nature Foundation Models (private corpus)",
    url: pageUrl,
    claimIds,
  });

  return { claims, nodes, indexed };
}

export function buildNfmPrivateClaimsFromEnv(cwd = process.cwd()) {
  const repoDir = resolveNfmRepoDir(cwd);
  if (!repoDir) return { claims: [], nodes: [], indexed: [] as NfmPrivateIndexedFile[] };
  return buildNfmPrivateClaims(repoDir);
}
