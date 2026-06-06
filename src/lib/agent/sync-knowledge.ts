import fs from "node:fs";
import path from "node:path";
import { loadHackathonsFromMarkdown } from "../../../prisma/load-hackathons-from-md";
import { loadProjectsFromMarkdown } from "../../../prisma/load-projects-from-md";
import { asraVideos } from "@/lib/asra";
import { exceptionalAbilitySections } from "@/lib/exceptional-ability";
import type { AgentClaim, ClaimsGraph } from "@/lib/agent/types";
import { loadSciLayerArticlesFromDisk } from "@/lib/agent/scilayer-content";

const SITE = "https://ilakk-manoharan.vercel.app";

export type KnowledgeNode = {
  id: string;
  type:
    | "claim-manual"
    | "claim-auto"
    | "claim-promoted"
    | "page"
    | "scilayer"
    | "project"
    | "hackathon"
    | "startup"
    | "evidence"
    | "recruiter";
  title: string;
  url: string;
  claimIds: string[];
};

export type KnowledgeGraphManifest = {
  version: number;
  lastSynced: string;
  siteUrl: string;
  claimCount: number;
  nodes: KnowledgeNode[];
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

function parseMarkdownBody(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8").trimStart();
  if (!raw.startsWith("---")) return raw;
  const afterFirst = raw.slice(3).replace(/^\r?\n/, "");
  const endMarker = afterFirst.search(/\r?\n---\r?\n/);
  if (endMarker === -1) return raw;
  return afterFirst.slice(endMarker + 4).trim();
}

function parseSimpleYaml(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1).replace(/\\n/g, "\n");
    }
    out[m[1]] = val;
  }
  return out;
}

function loadStartupsFromMarkdown(cwd: string) {
  const dir = path.join(cwd, "content", "startups");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8").trimStart();
      const afterFirst = raw.slice(3).replace(/^\r?\n/, "");
      const endMarker = afterFirst.search(/\r?\n---\r?\n/);
      const fm = parseSimpleYaml(
        endMarker === -1 ? "" : afterFirst.slice(0, endMarker).trim(),
      );
      const body = endMarker === -1 ? raw : afterFirst.slice(endMarker + 4).trim();
      const slug = fm.slug ?? path.basename(file, ".md");
      return {
        slug,
        name: fm.name ?? slug,
        tagline: fm.tagline ?? "",
        description: fm.description ?? "",
        problem: fm.problem ?? "",
        solution: fm.solution ?? "",
        targetUsers: fm.targetUsers ?? "",
        status: fm.status ?? "",
        body,
      };
    });
}

function makeClaim(
  id: string,
  text: string,
  topics: string[],
  sources: string[],
  origin: AgentClaim["origin"],
): AgentClaim {
  return {
    id,
    text,
    topics: [...new Set(topics.map((t) => t.toLowerCase()))],
    sources: [...new Set(sources)],
    origin,
    verified: origin !== "conversation",
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

export function buildAutoClaims(cwd = process.cwd()): {
  claims: AgentClaim[];
  nodes: KnowledgeNode[];
} {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];

  const qaPath = path.join(cwd, "public", "recruiter-data", "recruiter-qa.md");
  if (fs.existsSync(qaPath)) {
    const raw = fs.readFileSync(qaPath, "utf8");
    const chunks = raw.split(/\n##\s+/).map((c) => c.trim()).filter(Boolean);
    for (const chunk of chunks) {
      const lines = chunk.split("\n");
      const heading = lines[0]?.replace(/^#\s+/, "").trim() ?? "section";
      const text = lines.slice(1).join("\n").trim();
      if (!text) continue;
      const id = `claim-auto-recruiter-${slugify(heading)}`;
      claims.push(
        makeClaim(
          id,
          text,
          [heading, "recruiter", ...heading.split(/\s+/)],
          [`${SITE}/recruiter`],
          "recruiter",
        ),
      );
      nodes.push({
        id: `node-recruiter-${slugify(heading)}`,
        type: "recruiter",
        title: heading,
        url: `${SITE}/recruiter`,
        claimIds: [id],
      });
    }
  }

  for (const project of loadProjectsFromMarkdown(cwd)) {
    const url = `${SITE}/projects`;
    const file = path.join(cwd, "content", "projects", `${project.slug}.md`);
    const body = fs.existsSync(file) ? parseMarkdownBody(file) : "";
    const claimIds: string[] = [];

    const summaryId = `claim-auto-project-${project.slug}-summary`;
    claims.push(
      makeClaim(
        summaryId,
        `${project.title}: ${project.description} Role: ${project.role}. Status: ${project.status}. Tech: ${project.techStack.join(", ")}.`,
        [
          project.title,
          project.slug,
          ...project.filterTags,
          ...project.techStack,
        ],
        [url, project.githubUrl ?? url, project.websiteUrl ?? url].filter(
          Boolean,
        ) as string[],
        "project",
      ),
    );
    claimIds.push(summaryId);

    for (const [i, para] of splitParagraphs(body).entries()) {
      const id = `claim-auto-project-${project.slug}-p${i + 1}`;
      claims.push(
        makeClaim(
          id,
          para,
          [project.title, project.slug, ...project.filterTags],
          [url, project.githubUrl ?? url].filter(Boolean) as string[],
          "project",
        ),
      );
      claimIds.push(id);
    }

    nodes.push({
      id: `node-project-${project.slug}`,
      type: "project",
      title: project.title,
      url,
      claimIds,
    });
  }

  for (const h of loadHackathonsFromMarkdown(cwd)) {
    const url = `${SITE}/hackathons`;
    const file = path.join(cwd, "content", "hackathons", `${h.slug}.md`);
    const body = fs.existsSync(file) ? parseMarkdownBody(file) : "";
    const claimIds: string[] = [];
    const fields: [string, string | null][] = [
      ["Problem", h.problemAddressed],
      ["Solution", h.solutionSummary],
      ["Technical contribution", h.technicalContribution],
      ["Impact", h.impact],
      ["Model / tech", h.modelTech],
      ["Dataset", h.datasetUsed],
    ];
    for (const [label, value] of fields) {
      if (!value?.trim()) continue;
      const id = `claim-auto-hackathon-${h.slug}-${slugify(label)}`;
      claims.push(
        makeClaim(
          id,
          `${h.projectName} (${h.hackathonName}) — ${label}: ${value}`,
          [h.projectName, h.hackathonName, h.slug, "hackathon"],
          [url, h.githubUrl ?? url, h.kaggleUrl ?? url].filter(Boolean) as string[],
          "hackathon",
        ),
      );
      claimIds.push(id);
    }
    for (const [i, para] of splitParagraphs(body).entries()) {
      const id = `claim-auto-hackathon-${h.slug}-body-${i + 1}`;
      claims.push(
        makeClaim(
          id,
          para,
          [h.projectName, h.slug, "hackathon"],
          [url, h.githubUrl ?? url].filter(Boolean) as string[],
          "hackathon",
        ),
      );
      claimIds.push(id);
    }
    nodes.push({
      id: `node-hackathon-${h.slug}`,
      type: "hackathon",
      title: h.projectName,
      url,
      claimIds,
    });
  }

  for (const startup of loadStartupsFromMarkdown(cwd)) {
    const url = `${SITE}/startups`;
    const claimIds: string[] = [];
    const blocks: [string, string][] = [
      ["Overview", `${startup.name}: ${startup.tagline} ${startup.description}`],
      ["Problem", startup.problem],
      ["Solution", startup.solution],
      ["Target users", startup.targetUsers],
    ];
    for (const [label, text] of blocks) {
      if (!text.trim()) continue;
      const id = `claim-auto-startup-${startup.slug}-${slugify(label)}`;
      claims.push(
        makeClaim(
          id,
          text,
          [startup.name, startup.slug, "startup", "founder"],
          [url],
          "startup",
        ),
      );
      claimIds.push(id);
    }
    for (const [i, para] of splitParagraphs(startup.body).entries()) {
      const id = `claim-auto-startup-${startup.slug}-p${i + 1}`;
      claims.push(
        makeClaim(id, para, [startup.name, startup.slug, "startup"], [url], "startup"),
      );
      claimIds.push(id);
    }
    nodes.push({
      id: `node-startup-${startup.slug}`,
      type: "startup",
      title: startup.name,
      url,
      claimIds,
    });
  }

  for (const section of exceptionalAbilitySections) {
    const url = `${SITE}/exceptional-ability`;
    const claimIds: string[] = [];
    const titleTopics = section.title.split(/[\s—–-]+/).filter((w) => w.length > 2);

    for (const [i, para] of section.paragraphs.entries()) {
      const id = `claim-auto-evidence-${section.number}-p${i + 1}`;
      claims.push(
        makeClaim(
          id,
          para,
          [
            `evidence ${section.number}`,
            section.title,
            ...(section.hashtags?.map((h) => h.replace(/^#/, "")) ?? []),
            ...titleTopics,
          ],
          [url],
          "exceptional-ability",
        ),
      );
      claimIds.push(id);
    }
    for (const [i, bullet] of (section.bullets ?? []).entries()) {
      const id = `claim-auto-evidence-${section.number}-b${i + 1}`;
      claims.push(
        makeClaim(
          id,
          stripMarkdown(bullet),
          [section.title, ...(section.hashtags?.map((h) => h.replace(/^#/, "")) ?? [])],
          [url],
          "exceptional-ability",
        ),
      );
      claimIds.push(id);
    }
    nodes.push({
      id: `node-evidence-${section.number}`,
      type: "evidence",
      title: `Evidence ${section.number}: ${section.title}`,
      url,
      claimIds,
    });
  }

  for (const article of loadSciLayerArticlesFromDisk(cwd)) {
    const url = article.articleUrl;
    const claimIds: string[] = [];
    const sources = [
      url,
      article.githubUrl ?? url,
      `${SITE}/exceptional-ability`,
    ].filter(Boolean) as string[];

    if (article.abstract.trim()) {
      const abstractId = `claim-auto-scilayer-${article.slug}-abstract`;
      claims.push(
        makeClaim(
          abstractId,
          `${article.title}: ${article.abstract}`,
          [article.title, article.slug, ...article.keywords, "SciLayer", "ASRA"],
          sources,
          "scilayer",
        ),
      );
      claimIds.push(abstractId);
    }

    for (const [i, para] of splitParagraphs(article.manuscript).entries()) {
      const id = `claim-auto-scilayer-${article.slug}-p${i + 1}`;
      claims.push(
        makeClaim(
          id,
          para,
          [article.title, article.slug, ...article.keywords, "SciLayer", "ARC"],
          sources,
          "scilayer",
        ),
      );
      claimIds.push(id);
    }

    nodes.push({
      id: `node-scilayer-${article.slug}`,
      type: "scilayer",
      title: article.title,
      url,
      claimIds,
    });
  }

  for (const [i, video] of asraVideos.entries()) {
    const id = `claim-auto-asra-video-${i + 1}`;
    claims.push(
      makeClaim(
        id,
        `${video.title}: ${video.description}`,
        ["ASRA", "Decision Biology", "Nature Foundation Models", "video", "asra"],
        [`${SITE}/asra`, video.youtubeUrl],
        "page",
      ),
    );
    nodes.push({
      id: `node-asra-video-${i + 1}`,
      type: "page",
      title: video.title,
      url: `${SITE}/asra`,
      claimIds: [id],
    });
  }

  const homeClaim = makeClaim(
    "claim-auto-home-intro",
    "Ilakkuvaselvi (Ilak) Manoharan is a software engineer, AI systems builder, and founder building at the intersection of distributed systems, full-stack engineering, scientific AI, and product innovation.",
    ["home", "portfolio", "about", "ilak"],
    [SITE],
    "page",
  );
  claims.push(homeClaim);
  nodes.push({
    id: "node-home",
    type: "page",
    title: "Home",
    url: SITE,
    claimIds: [homeClaim.id],
  });

  return { claims, nodes };
}

export function mergeClaimsGraph(
  existing: ClaimsGraph,
  autoClaims: AgentClaim[],
  promoted: AgentClaim[] = [],
): ClaimsGraph {
  const manual = existing.claims.filter(
    (c) =>
      c.origin === "manual" ||
      (!c.id.startsWith("claim-auto-") && c.origin !== "conversation"),
  );
  const merged = [...manual, ...autoClaims, ...promoted];
  const byId = new Map<string, AgentClaim>();
  for (const c of merged) {
    byId.set(c.id, c);
  }
  return {
    version: (existing.version ?? 1) + 1,
    lastSynced: new Date().toISOString().slice(0, 10),
    claims: [...byId.values()],
  };
}

export function loadPromotedClaims(cwd = process.cwd()): AgentClaim[] {
  const file = path.join(cwd, "content", "agent", "promoted-claims.json");
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    claims?: AgentClaim[];
  };
  return (raw.claims ?? []).map((c) => ({
    ...c,
    origin: "conversation" as const,
    verified: true,
  }));
}

export function syncKnowledgeGraph(cwd = process.cwd()) {
  const claimsPath = path.join(cwd, "content", "agent", "claims.json");
  const graphPath = path.join(cwd, "content", "agent", "knowledge-graph.json");
  const existing = JSON.parse(fs.readFileSync(claimsPath, "utf8")) as ClaimsGraph;

  for (const c of existing.claims) {
    if (!c.origin && !c.id.startsWith("claim-auto-")) {
      c.origin = "manual";
      c.verified = c.verified ?? true;
    }
  }

  const { claims: autoClaims, nodes } = buildAutoClaims(cwd);
  const promoted = loadPromotedClaims(cwd);
  const graph = mergeClaimsGraph(existing, autoClaims, promoted);

  const manifest: KnowledgeGraphManifest = {
    version: graph.version,
    lastSynced: graph.lastSynced ?? new Date().toISOString().slice(0, 10),
    siteUrl: SITE,
    claimCount: graph.claims.length,
    nodes,
  };

  fs.writeFileSync(claimsPath, `${JSON.stringify(graph, null, 2)}\n`);
  fs.writeFileSync(graphPath, `${JSON.stringify(manifest, null, 2)}\n`);

  return { graph, manifest, autoCount: autoClaims.length, promotedCount: promoted.length };
}
