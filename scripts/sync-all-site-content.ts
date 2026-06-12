#!/usr/bin/env tsx
/**
 * Sync git-tracked **production content sources** into the agent knowledge graph.
 * Does not modify production pages — pages read content/*.md and evidence TS directly.
 *
 * Run after adding or editing production sources when you want agents aligned:
 *   content/projects/*.md, content/hackathons/*.md, content/startups/*.md
 *   content/founder-studio/*.md, content/skills/*.md, content/scilayer/articles/, exceptional-ability modules, recruiter Q&A
 *
 * Usage:
 *   npm run content:sync              # rebuild claims from local content
 *   npm run content:sync -- --fetch-scilayer   # also refresh SciLayer mirror from GitHub
 *
 * Vercel build runs `content:sync` before `next build` (re-indexes committed site content into claims; does not change page sources).
 */
import path from "node:path";
import fs from "node:fs";
import { fetchAndCacheSciLayerArticles, loadSciLayerArticlesFromDisk } from "../src/lib/agent/scilayer-content";
import { buildProjectRepoClaims } from "../src/lib/agent/project-repos-sync";
import { syncKnowledgeGraph } from "../src/lib/agent/sync-knowledge";
import { exceptionalAbilitySections } from "../src/lib/exceptional-ability";
import { loadFounderStudioFromMarkdown } from "../prisma/load-founder-studio-from-md";
import { loadHackathonsFromMarkdown } from "../prisma/load-hackathons-from-md";
import { loadProjectsFromMarkdown } from "../prisma/load-projects-from-md";
import { loadSkillsFromMarkdown } from "../prisma/load-skills-from-md";
import { loadStartupsFromMarkdown } from "../prisma/load-startups-from-md";

const args = process.argv.slice(2);

async function main() {
  const cwd = process.cwd();

  const fetchSciLayer =
    args.includes("--fetch-scilayer") || process.env.SYNC_FETCH_SCILAYER === "1";
  if (fetchSciLayer) {
    const articles = await fetchAndCacheSciLayerArticles(cwd);
    console.log(
      `SciLayer: cached ${articles.length} Ilak-authored articles → content/scilayer/articles/`,
    );
  }

  const projects = loadProjectsFromMarkdown(cwd).length;
  const startups = loadStartupsFromMarkdown(cwd).length;
  const founderStudio = loadFounderStudioFromMarkdown(cwd).length;
  const skills = loadSkillsFromMarkdown(cwd).length;
  const hackathons = loadHackathonsFromMarkdown(cwd).length;
  const evidence = exceptionalAbilitySections.length;
  const scilayer = loadSciLayerArticlesFromDisk(cwd).length;
  const projectRepos = buildProjectRepoClaims(cwd);
  const asraMarketingDir = process.env.ASRA_MARKETING_DIR?.trim()
    ? path.resolve(process.env.ASRA_MARKETING_DIR)
    : path.join(cwd, "content", "marketing", "asra");
  const asraMarketingFiles = fs.existsSync(asraMarketingDir)
    ? fs.readdirSync(asraMarketingDir, { recursive: true }).filter(
        (f) => typeof f === "string" && f.endsWith(".md"),
      ).length
    : 0;
  const arcNeurogolfMarketingDir = path.join(cwd, "content", "marketing", "arc-neurogolf");
  const arcNeurogolfMarketingFiles = fs.existsSync(arcNeurogolfMarketingDir)
    ? fs.readdirSync(arcNeurogolfMarketingDir).filter((f) => f.endsWith(".md")).length
    : 0;
  const asraSecurityMarketingDir = path.join(cwd, "content", "marketing", "asra-security");
  const asraSecurityMarketingFiles = fs.existsSync(asraSecurityMarketingDir)
    ? fs.readdirSync(asraSecurityMarketingDir).filter((f) => f.endsWith(".md")).length
    : 0;

  const notebookApplicationsDir = process.env.NOTEBOOK_STARTUP_APPLICATIONS?.trim();
  const notebookAppliedDir = process.env.NOTEBOOK_APPLIED?.trim();
  const fetchLiveSite =
    args.includes("--fetch-live-site") || process.env.SYNC_LIVE_SITE === "1";

  const { graph, manifest, autoCount, promotedCount } = await syncKnowledgeGraph(
    cwd,
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

  console.log("Site content indexed:");
  console.log(`  projects (markdown): ${projects}`);
  console.log(`  startups (markdown): ${startups}`);
  console.log(`  founder-studio (markdown): ${founderStudio}`);
  console.log(`  skills (markdown): ${skills}`);
  console.log(`  hackathons (markdown): ${hackathons}`);
  console.log(`  exceptional-ability sections: ${evidence}`);
  console.log(`  scilayer articles (local, Ilak-authored): ${scilayer}`);
  console.log(
    `  project repos (local): ${projectRepos.indexed.length} indexed (${projectRepos.indexed.map((p) => p.slug).join(", ") || "none"})`,
  );
  console.log(`  asra marketing (mirror): ${asraMarketingFiles} markdown file(s)`);
  console.log(`  arc-neurogolf marketing (mirror): ${arcNeurogolfMarketingFiles} markdown file(s)`);
  console.log(`  asra-security marketing (mirror): ${asraSecurityMarketingFiles} markdown file(s)`);
  console.log(
    `Knowledge graph: ${graph.claims.length} claims (${autoCount} auto, ${promotedCount} promoted, ${manifest.nodes.length} nodes)`,
  );
  console.log("→ content/agent/claims.json");
  console.log("→ content/agent/knowledge-graph.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
