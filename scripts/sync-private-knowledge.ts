#!/usr/bin/env tsx
/**
 * Index gitignored private/ content into the local knowledge graph overlay.
 * Does NOT modify content/agent/claims.json (production corpus) or the live site.
 *
 * Overlay files (gitignored via private/):
 *   private/agent-knowledge/claims-overlay.json
 *   private/agent-knowledge/knowledge-graph-overlay.json
 *
 * Merged at agent runtime by loadClaimsGraph() when the overlay exists locally.
 *
 * Usage:
 *   npm run agent:sync-private
 *   npm run agent:sync-private -- --also-public   # refresh public claims first
 */
import path from "node:path";
import { syncKnowledgeGraph } from "../src/lib/agent/sync-knowledge";
import {
  PRIVATE_CONTENT_SOURCES,
  syncPrivateContentOverlay,
} from "../src/lib/agent/private-content-sync";

const args = process.argv.slice(2);

async function main() {
  const cwd = process.cwd();

  if (args.includes("--also-public")) {
    console.log("Refreshing public knowledge graph (content/agent/claims.json)…");
    const { graph, manifest, autoCount, promotedCount } =
      await syncKnowledgeGraph(cwd);
    console.log(
      `  Public: ${graph.claims.length} claims (${autoCount} auto, ${promotedCount} promoted, ${manifest.nodes.length} nodes)`,
    );
  }

  console.log("Indexing private content…");
  for (const src of PRIVATE_CONTENT_SOURCES) {
    console.log(`  • ${src.rel}`);
  }

  const { stats, claimsPath, graphPath } = syncPrivateContentOverlay(cwd);

  console.log("\nPrivate overlay synced:");
  for (const [rel, count] of Object.entries(stats.bySource)) {
    console.log(`  ${rel}: ${count} file(s)`);
  }
  console.log(
    `\n  ${stats.files} files → ${stats.claims} claims, ${stats.nodes} nodes`,
  );
  console.log(`→ ${path.relative(cwd, claimsPath)}`);
  console.log(`→ ${path.relative(cwd, graphPath)}`);
  console.log(
    "\nNote: overlay merges into agent retrieval locally only; production deploy is unchanged.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
