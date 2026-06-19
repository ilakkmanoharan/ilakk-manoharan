import fs from "node:fs";
import path from "node:path";
import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeGraphManifest, KnowledgeNode } from "@/lib/agent/sync-knowledge";
import {
  buildNfmPrivateClaimsFromEnv,
  listNfmPrivateWatchPaths,
} from "@/lib/agent/nfm-private-sync";

/** Gitignored overlay — local agent corpus only; never deployed to Vercel. */
export const PRIVATE_CLAIMS_OVERLAY = path.join(
  "private",
  "agent-knowledge",
  "claims-overlay.json",
);

export const PRIVATE_GRAPH_OVERLAY = path.join(
  "private",
  "agent-knowledge",
  "knowledge-graph-overlay.json",
);

export type PrivateContentSource = {
  /** Path relative to repo root, file or directory */
  rel: string;
  kind: string;
  label: string;
  topics: string[];
};

/** Private folders/files indexed into the local knowledge graph overlay. */
export const PRIVATE_CONTENT_SOURCES: PrivateContentSource[] = [
  {
    rel: "private/agent-knowledge/Q-A-bank",
    kind: "private-qa-bank",
    label: "Agent Q&A bank",
    topics: ["qa", "agent", "recruiter", "interview", "investor", "project"],
  },
  { rel: "private/DMs", kind: "private-dm", label: "DM", topics: ["dm", "outreach", "private"] },
  {
    rel: "private/exceptional-ability",
    kind: "private-evidence",
    label: "Exceptional ability (private)",
    topics: ["exceptional ability", "evidence", "private"],
  },
  {
    rel: "private/hackathons",
    kind: "private-hackathon",
    label: "Hackathon (private)",
    topics: ["hackathon", "private"],
  },
  {
    rel: "private/interview-questions",
    kind: "private-interview",
    label: "Interview Q&A",
    topics: ["interview", "private"],
  },
  {
    rel: "private/marketing",
    kind: "private-marketing",
    label: "Marketing",
    topics: ["marketing", "private"],
  },
  {
    rel: "private/pitch-decks",
    kind: "private-pitch",
    label: "Pitch deck",
    topics: ["pitch", "startup", "private"],
  },
  {
    rel: "private/startup-applications",
    kind: "private-startup-app",
    label: "Startup application",
    topics: ["startup application", "accelerator", "private"],
  },
  {
    rel: "private/startup-catalog",
    kind: "private-startup-catalog",
    label: "Startup catalog (private)",
    topics: ["startup catalog", "private"],
  },
  {
    rel: "private/profile.md",
    kind: "private-profile",
    label: "Profile",
    topics: ["profile", "private"],
  },
  {
    rel: "private/conversations",
    kind: "private-conversation",
    label: "Conversation",
    topics: ["conversation", "private"],
  },
  {
    rel: "private/project-pages",
    kind: "private-project-page",
    label: "Project page (private)",
    topics: ["project", "private"],
  },
  {
    rel: "private/projects",
    kind: "private-project",
    label: "Project (private)",
    topics: ["project", "private"],
  },
  {
    rel: "private/resume-faqs",
    kind: "private-resume-faq",
    label: "Resume FAQ",
    topics: ["resume", "faq", "private"],
  },
  {
    rel: "private/resumes",
    kind: "private-resume",
    label: "Resume",
    topics: ["resume", "private"],
  },
];

const TEXT_EXTENSIONS = new Set([".md", ".txt", ".markdown"]);

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
    origin: "private",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

function privateSourceUri(relPath: string) {
  return `private://${relPath.replace(/\\/g, "/")}`;
}

function collectTextFiles(root: string, relRoot: string, out: string[] = []) {
  if (!fs.existsSync(root)) return out;

  const stat = fs.statSync(root);
  if (stat.isFile()) {
    if (TEXT_EXTENSIONS.has(path.extname(root).toLowerCase())) {
      out.push(root);
    }
    return out;
  }

  for (const entry of fs.readdirSync(root).sort()) {
    if (entry.startsWith(".")) continue;
    const full = path.join(root, entry);
    const rel = path.join(relRoot, entry);
    const s = fs.statSync(full);
    if (s.isDirectory()) {
      collectTextFiles(full, rel, out);
    } else if (TEXT_EXTENSIONS.has(path.extname(entry).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

function ingestFile(
  filePath: string,
  relFromRepo: string,
  source: PrivateContentSource,
): { claims: AgentClaim[]; node: KnowledgeNode | null } {
  const claims: AgentClaim[] = [];
  const raw = fs.readFileSync(filePath, "utf8");
  const relSlug = slugify(relFromRepo.replace(/[/\\]/g, "-").replace(/\.[^.]+$/, ""));
  const sourceUri = privateSourceUri(relFromRepo);
  const claimIds: string[] = [];

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title =
    titleMatch?.[1]?.trim() ??
    path.basename(filePath, path.extname(filePath)).replace(/-/g, " ");

  const summaryId = `claim-auto-${source.kind}-${relSlug}-file`;
  claims.push(
    makeClaim(
      summaryId,
      `${source.label} (${title}): ${stripMarkdown(raw.slice(0, 500))}`,
      [title, relSlug, ...source.topics],
      [sourceUri, filePath],
    ),
  );
  claimIds.push(summaryId);

  for (const [i, para] of splitParagraphs(raw).entries()) {
    const id = `claim-auto-${source.kind}-${relSlug}-p${i + 1}`;
    claims.push(
      makeClaim(id, para, [title, relSlug, ...source.topics], [sourceUri, filePath]),
    );
    claimIds.push(id);
  }

  const node: KnowledgeNode = {
    id: `node-${source.kind}-${relSlug}`,
    type: "page",
    title: `${source.label}: ${title}`,
    url: sourceUri,
    claimIds,
  };

  return { claims, node };
}

export type PrivateSyncStats = {
  files: number;
  claims: number;
  nodes: number;
  bySource: Record<string, number>;
};

export function buildPrivateContentClaims(cwd = process.cwd()): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
  stats: PrivateSyncStats;
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const stats: PrivateSyncStats = {
    files: 0,
    claims: 0,
    nodes: 0,
    bySource: {},
  };

  for (const source of PRIVATE_CONTENT_SOURCES) {
    const abs = path.join(cwd, source.rel);
    const files = collectTextFiles(abs, source.rel);
    stats.bySource[source.rel] = files.length;

    for (const filePath of files) {
      const relFromRepo = path.relative(cwd, filePath);
      const batch = ingestFile(filePath, relFromRepo, source);
      claims.push(...batch.claims);
      if (batch.node) nodes.push(batch.node);
      stats.files += 1;
    }
  }

  const nfmPrivate = buildNfmPrivateClaimsFromEnv(cwd);
  if (nfmPrivate.indexed.length > 0) {
    claims.push(...nfmPrivate.claims);
    nodes.push(...nfmPrivate.nodes);
    stats.bySource["Nature-Foundation-Models/private"] = nfmPrivate.indexed.length;
    stats.files += nfmPrivate.indexed.length;
  }

  stats.claims = claims.length;
  stats.nodes = nodes.length;
  return { claims, nodes, stats };
}

export function syncPrivateContentOverlay(cwd = process.cwd()) {
  const { claims, nodes, stats } = buildPrivateContentClaims(cwd);
  const overlayDir = path.join(cwd, path.dirname(PRIVATE_CLAIMS_OVERLAY));
  fs.mkdirSync(overlayDir, { recursive: true });

  const claimsPath = path.join(cwd, PRIVATE_CLAIMS_OVERLAY);
  const graphPath = path.join(cwd, PRIVATE_GRAPH_OVERLAY);
  const synced = new Date().toISOString().slice(0, 10);

  const overlayGraph = {
    version: 1,
    lastSynced: synced,
    claims,
  };

  const overlayManifest: KnowledgeGraphManifest = {
    version: 1,
    lastSynced: synced,
    siteUrl: "local-private",
    claimCount: claims.length,
    nodes,
  };

  fs.writeFileSync(claimsPath, `${JSON.stringify(overlayGraph, null, 2)}\n`);
  fs.writeFileSync(graphPath, `${JSON.stringify(overlayManifest, null, 2)}\n`);

  return { stats, claimsPath, graphPath };
}

export function listPrivateWatchPaths(cwd = process.cwd()) {
  return [
    ...PRIVATE_CONTENT_SOURCES.map((s) => path.join(cwd, s.rel)),
    ...listNfmPrivateWatchPaths(cwd),
  ];
}
