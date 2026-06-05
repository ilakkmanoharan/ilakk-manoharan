import fs from "node:fs";
import path from "node:path";
import type { ClaimsGraph } from "@/lib/agent/types";
import { exceptionalAbilitySections } from "@/lib/exceptional-ability";

let cachedClaims: ClaimsGraph | null = null;

export function loadClaimsGraph(): ClaimsGraph {
  if (cachedClaims) return cachedClaims;
  const file = path.join(process.cwd(), "content", "agent", "claims.json");
  const raw = fs.readFileSync(file, "utf8");
  cachedClaims = JSON.parse(raw) as ClaimsGraph;
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
