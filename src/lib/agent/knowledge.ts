import fs from "node:fs";
import path from "node:path";
import type { AgentClaim, ClaimsGraph } from "@/lib/agent/types";
import { PRIVATE_CLAIMS_OVERLAY } from "@/lib/agent/private-content-sync";
import { exceptionalAbilitySections } from "@/lib/exceptional-ability";

let cachedClaims: ClaimsGraph | null = null;

export function invalidateClaimsCache() {
  cachedClaims = null;
}

function loadPrivateClaimsOverlay(cwd = process.cwd()): AgentClaim[] {
  const file = path.join(cwd, PRIVATE_CLAIMS_OVERLAY);
  if (!fs.existsSync(file)) return [];
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as { claims?: AgentClaim[] };
  return raw.claims ?? [];
}

export function loadClaimsGraph(): ClaimsGraph {
  if (cachedClaims) return cachedClaims;
  const file = path.join(process.cwd(), "content", "agent", "claims.json");
  const raw = fs.readFileSync(file, "utf8");
  const base = JSON.parse(raw) as ClaimsGraph;

  const overlay = loadPrivateClaimsOverlay();
  if (overlay.length === 0) {
    cachedClaims = base;
    return cachedClaims;
  }

  const byId = new Map(base.claims.map((c) => [c.id, c]));
  for (const c of overlay) byId.set(c.id, c);
  cachedClaims = {
    ...base,
    claims: [...byId.values()],
  };
  return cachedClaims;
}

export function loadRecruiterChunks(): string[] {
  const file = path.join(
    process.cwd(),
    "public",
    "recruiter-data",
    "recruiter-qa.md",
  );
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .split(/\n##\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
}

export function getEvidenceSection(number: number) {
  return exceptionalAbilitySections.find((s) => s.number === number) ?? null;
}

export function getProjectMarkdown(slug: string): string | null {
  const file = path.join(process.cwd(), "content", "projects", `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

export function listProjectSlugs(): string[] {
  const dir = path.join(process.cwd(), "content", "projects");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function loadKnowledgeGraphManifest() {
  const file = path.join(process.cwd(), "content", "agent", "knowledge-graph.json");
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
