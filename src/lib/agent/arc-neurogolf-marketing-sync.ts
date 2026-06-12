import fs from "node:fs";
import path from "node:path";
import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";

const SITE = "https://ilakk-manoharan.vercel.app";
const REPO = "https://github.com/ilakkmanoharan/ARC-NeuroGolf";
const KAGGLE = "https://www.kaggle.com/competitions/neurogolf-2026";

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
    origin: "page",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

function collectTextFiles(root: string, out: string[] = []) {
  if (!fs.existsSync(root)) return out;
  const stat = fs.statSync(root);
  if (stat.isFile()) {
    if (TEXT_EXTENSIONS.has(path.extname(root).toLowerCase())) out.push(root);
    return out;
  }
  for (const entry of fs.readdirSync(root).sort()) {
    if (entry.startsWith(".")) continue;
    const full = path.join(root, entry);
    const s = fs.statSync(full);
    if (s.isDirectory()) collectTextFiles(full, out);
    else if (TEXT_EXTENSIONS.has(path.extname(entry).toLowerCase())) out.push(full);
  }
  return out;
}

/** Ingest ARC-NeuroGolf / ARC-Genome paper and docs into the knowledge graph. */
export function buildArcNeurogolfMarketingClaims(marketingDir: string): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const abs = path.resolve(marketingDir);
  if (!fs.existsSync(abs)) return { claims, nodes };

  const baseTopics = [
    "ARC-Genome",
    "ARC-NeuroGolf",
    "NeuroGolf",
    "ARC-AGI",
    "ONNX",
    "neural circuits",
    "Kaggle",
    "program synthesis",
    "minimum description length",
  ];
  const pageUrl = `${SITE}/projects`;

  for (const filePath of collectTextFiles(abs)) {
    const rel = path.relative(abs, filePath);
    const relSlug = slugify(rel.replace(/[/\\]/g, "-").replace(/\.[^.]+$/, ""));
    const raw = fs.readFileSync(filePath, "utf8");
    const claimIds: string[] = [];

    const titleMatch = raw.match(/^#\s+(.+)$/m);
    const title =
      titleMatch?.[1]?.trim() ??
      path.basename(filePath, path.extname(filePath)).replace(/-/g, " ");

    const sources = [pageUrl, REPO, KAGGLE, `${REPO}/blob/main/private/paper.md`];

    const summaryId = `claim-auto-arc-neurogolf-marketing-${relSlug}-file`;
    claims.push(
      makeClaim(
        summaryId,
        `ARC-Genome / NeuroGolf (${title}): ${stripMarkdown(raw.slice(0, 500))}`,
        [title, relSlug, ...baseTopics],
        sources,
      ),
    );
    claimIds.push(summaryId);

    for (const [i, para] of splitParagraphs(raw).entries()) {
      const id = `claim-auto-arc-neurogolf-marketing-${relSlug}-p${i + 1}`;
      claims.push(makeClaim(id, para, [title, relSlug, ...baseTopics], sources));
      claimIds.push(id);
    }

    nodes.push({
      id: `node-arc-neurogolf-marketing-${relSlug}`,
      type: "project",
      title: `ARC-Genome: ${title}`,
      url: pageUrl,
      claimIds,
    });
  }

  return { claims, nodes };
}

export function resolveArcNeurogolfMarketingDir(cwd = process.cwd()): string | undefined {
  const env = process.env.ARC_NEUROGOLF_MARKETING_DIR?.trim();
  if (env) return path.resolve(env);

  const mirrored = path.join(cwd, "content", "marketing", "arc-neurogolf");
  if (fs.existsSync(mirrored)) return mirrored;

  const sibling = path.resolve(cwd, "../ARC-NeuroGolf/private");
  if (fs.existsSync(sibling)) return sibling;

  return undefined;
}
