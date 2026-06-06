#!/usr/bin/env tsx
/**
 * Sync all git-tracked site content into the agent knowledge graph.
 *
 * Run after adding or editing:
 *   content/projects/*.md, content/hackathons/*.md, content/startups/*.md
 *   content/founder-studio/*.md, content/skills/*.md, content/scilayer/articles/, exceptional-ability modules, recruiter Q&A
 *
 * Usage:
 *   npm run content:sync              # rebuild claims from local content
 *   npm run content:sync -- --fetch-scilayer   # also refresh SciLayer mirror from GitHub
 *
 * Vercel build runs `content:sync` automatically before `next build`.
 */
import { fetchAndCacheSciLayerArticles, loadSciLayerArticlesFromDisk } from "../src/lib/agent/scilayer-content";
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

  if (args.includes("--fetch-scilayer")) {
    const articles = await fetchAndCacheSciLayerArticles(cwd);
    console.log(`SciLayer: cached ${articles.length} articles → content/scilayer/articles/`);
  }

  const projects = loadProjectsFromMarkdown(cwd).length;
  const startups = loadStartupsFromMarkdown(cwd).length;
  const founderStudio = loadFounderStudioFromMarkdown(cwd).length;
  const skills = loadSkillsFromMarkdown(cwd).length;
  const hackathons = loadHackathonsFromMarkdown(cwd).length;
  const evidence = exceptionalAbilitySections.length;
  const scilayer = loadSciLayerArticlesFromDisk(cwd).length;

  const { graph, manifest, autoCount, promotedCount } = syncKnowledgeGraph(cwd);

  console.log("Site content indexed:");
  console.log(`  projects (markdown): ${projects}`);
  console.log(`  startups (markdown): ${startups}`);
  console.log(`  founder-studio (markdown): ${founderStudio}`);
  console.log(`  skills (markdown): ${skills}`);
  console.log(`  hackathons (markdown): ${hackathons}`);
  console.log(`  exceptional-ability sections: ${evidence}`);
  console.log(`  scilayer articles (local): ${scilayer}`);
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
