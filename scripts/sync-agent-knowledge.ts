#!/usr/bin/env tsx
/**
 * Rebuild content/agent/claims.json and knowledge-graph.json from site content.
 * Preserves manual claims; replaces claim-auto-* from projects, hackathons,
 * startups, exceptional-ability, recruiter Q&A, ASRA page content,
 * optional notebook startup-applications, and optional live production site fetch.
 *
 * Usage:
 *   npm run agent:sync-knowledge
 *   npm run agent:sync-knowledge -- --notebook-applications /path/to/notebook/startup-applications
 *   npm run agent:sync-knowledge -- --fetch-live-site
 *   NOTEBOOK_STARTUP_APPLICATIONS=... SYNC_LIVE_SITE=1 npm run agent:sync-knowledge
 */
import path from "node:path";
import { syncKnowledgeGraph } from "../src/lib/agent/sync-knowledge";

const args = process.argv.slice(2);

function argValue(flag: string) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

if (args.includes("--llm")) {
  console.warn(
    "Note: --llm enrichment is reserved for a future pass; deterministic sync runs now.",
  );
}

const notebookApplicationsDir =
  argValue("--notebook-applications") ??
  process.env.NOTEBOOK_STARTUP_APPLICATIONS?.trim();

const notebookAppliedDir =
  argValue("--notebook-applied") ?? process.env.NOTEBOOK_APPLIED?.trim();

const fetchLiveSite =
  args.includes("--fetch-live-site") || process.env.SYNC_LIVE_SITE === "1";

async function main() {
  const { graph, manifest, autoCount, promotedCount } = await syncKnowledgeGraph(
    process.cwd(),
    {
      notebookApplicationsDir: notebookApplicationsDir
        ? path.resolve(notebookApplicationsDir)
        : undefined,
      notebookAppliedDir: notebookAppliedDir
        ? path.resolve(notebookAppliedDir)
        : undefined,
      fetchLiveSite,
    },
  );

  console.log(
    `Synced ${graph.claims.length} claims (${autoCount} auto, ${promotedCount} promoted, ${manifest.nodes.length} nodes)`,
  );
  if (notebookApplicationsDir) {
    console.log(`  + startup applications: ${path.resolve(notebookApplicationsDir)}`);
  }
  if (notebookAppliedDir) {
    console.log(`  + notebook applied: ${path.resolve(notebookAppliedDir)}`);
  }
  if (fetchLiveSite) {
    console.log("  + live production site fetch");
  }
  console.log(`→ content/agent/claims.json`);
  console.log(`→ content/agent/knowledge-graph.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
