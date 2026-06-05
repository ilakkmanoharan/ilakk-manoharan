#!/usr/bin/env tsx
/**
 * Sync recruiter Q&A headings into content/agent/claims.json (manual topics preserved).
 */
import fs from "node:fs";
import path from "node:path";

type Claim = {
  id: string;
  text: string;
  topics: string[];
  sources: string[];
};

type Graph = { version: number; lastSynced: string; claims: Claim[] };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function main() {
  const claimsPath = path.join(process.cwd(), "content", "agent", "claims.json");
  const graph = JSON.parse(fs.readFileSync(claimsPath, "utf8")) as Graph;
  const existingIds = new Set(graph.claims.map((c) => c.id));

  const qaPath = path.join(
    process.cwd(),
    "public",
    "recruiter-data",
    "recruiter-qa.md",
  );
  const raw = fs.readFileSync(qaPath, "utf8");
  const chunks = raw.split(/\n##\s+/).map((c) => c.trim()).filter(Boolean);

  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    const heading = lines[0]?.replace(/^#\s+/, "").trim() ?? "section";
    const text = lines.slice(1).join("\n").trim();
    if (!text) continue;
    const id = `claim-recruiter-${slugify(heading)}`;
    if (existingIds.has(id)) continue;
    graph.claims.push({
      id,
      text,
      topics: [heading.toLowerCase(), "recruiter"],
      sources: ["https://ilakk-manoharan.vercel.app/recruiter"],
    });
  }

  graph.lastSynced = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(claimsPath, `${JSON.stringify(graph, null, 2)}\n`);
  console.log(`Synced claims (${graph.claims.length} total) → ${claimsPath}`);
}

main();
