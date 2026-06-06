#!/usr/bin/env tsx
/**
 * Rebuild content/agent/claims.json and knowledge-graph.json from site content.
 * Preserves manual claims; replaces claim-auto-* from projects, hackathons,
 * startups, exceptional-ability, recruiter Q&A, and ASRA page content.
 *
 * Optional: OPENAI_API_KEY + --llm to enrich topic tags (not required for sync).
 */
import { syncKnowledgeGraph } from "../src/lib/agent/sync-knowledge";

const args = process.argv.slice(2);
if (args.includes("--llm")) {
  console.warn(
    "Note: --llm enrichment is reserved for a future pass; deterministic sync runs now.",
  );
}

const { graph, manifest, autoCount, promotedCount } = syncKnowledgeGraph();
console.log(
  `Synced ${graph.claims.length} claims (${autoCount} auto, ${promotedCount} promoted, ${manifest.nodes.length} nodes)`,
);
console.log(`→ content/agent/claims.json`);
console.log(`→ content/agent/knowledge-graph.json`);
