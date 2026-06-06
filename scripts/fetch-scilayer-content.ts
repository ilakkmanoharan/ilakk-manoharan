#!/usr/bin/env tsx
/**
 * Mirror SciLayer published content into content/scilayer/ for the agent knowledge graph.
 * Source: https://github.com/ilakkmanoharan/SciLayer/tree/main/content
 */
import { fetchAndCacheSciLayerArticles } from "../src/lib/agent/scilayer-content";

async function main() {
  const articles = await fetchAndCacheSciLayerArticles();
  console.log(`Cached ${articles.length} SciLayer articles → content/scilayer/articles/`);
  for (const a of articles) {
    console.log(`  · ${a.slug}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
