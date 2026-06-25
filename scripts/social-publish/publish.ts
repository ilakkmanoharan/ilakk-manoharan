#!/usr/bin/env tsx
/**
 * Publish social posts from `social/` to X, LinkedIn, and content/social/posts.json.
 *
 * Usage:
 *   npx tsx scripts/social-publish/publish.ts --file social/my-post.md
 *   npx tsx scripts/social-publish/publish.ts --from-git-diff
 *   SOCIAL_DRY_RUN=1 npx tsx scripts/social-publish/publish.ts --file social/my-post.md
 */
import { execSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { parseSocialFile, shouldSkipSource } from "./parse-post";
import { postToLinkedIn } from "./linkedin-client";
import { postToX } from "./x-client";

type SocialFeedPost = {
  id: string;
  slug: string;
  sourceFile: string;
  title: string | null;
  body: string;
  tags: string[];
  link: string | null;
  publishedAt: string;
  x: { postId: string; url: string } | null;
  linkedin: { postId: string; url: string } | null;
  siteUrl: string;
};

type SocialFeed = {
  version: number;
  posts: SocialFeedPost[];
};

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ??
  "https://ilakk-manoharan.vercel.app";

function isDryRun(): boolean {
  return process.env.SOCIAL_DRY_RUN === "1" || process.env.SOCIAL_DRY_RUN === "true";
}

function loadFeed(repoRoot: string): SocialFeed {
  const feedPath = path.join(repoRoot, "content", "social", "posts.json");
  if (!fs.existsSync(feedPath)) {
    return { version: 1, posts: [] };
  }
  return JSON.parse(fs.readFileSync(feedPath, "utf8")) as SocialFeed;
}

function saveFeed(repoRoot: string, feed: SocialFeed): void {
  const feedPath = path.join(repoRoot, "content", "social", "posts.json");
  fs.mkdirSync(path.dirname(feedPath), { recursive: true });
  feed.posts.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
  fs.writeFileSync(feedPath, `${JSON.stringify(feed, null, 2)}\n`, "utf8");
}

function alreadyPublished(feed: SocialFeed, sourceFile: string): boolean {
  return feed.posts.some((p) => p.sourceFile === sourceFile);
}

function filesFromGitDiff(repoRoot: string): string[] {
  const before = process.env.GITHUB_EVENT_BEFORE?.trim();
  const after = process.env.GITHUB_SHA?.trim() ?? "HEAD";

  let diffCmd: string;
  if (before && before !== "0000000000000000000000000000000000000000") {
    diffCmd = `git diff --name-only --diff-filter=AM ${before} ${after} -- social/`;
  } else {
    diffCmd = "git diff --name-only --diff-filter=AM HEAD~1 HEAD -- social/";
  }

  try {
    const output = execSync(diffCmd, { cwd: repoRoot, encoding: "utf8" }).trim();
    if (!output) return [];
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.startsWith("social/"))
      .filter((line) => /\.(md|json)$/i.test(line))
      .filter((line) => !shouldSkipSource(line));
  } catch {
    return [];
  }
}

function parseArgs(repoRoot: string): string[] {
  const args = process.argv.slice(2);
  const files: string[] = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--file" && args[i + 1]) {
      files.push(path.resolve(repoRoot, args[i + 1]!));
      i++;
    } else if (args[i] === "--files" && args[i + 1]) {
      for (const f of args[i + 1]!.split(",")) {
        files.push(path.resolve(repoRoot, f.trim()));
      }
      i++;
    }
  }

  if (args.includes("--from-git-diff")) {
    for (const rel of filesFromGitDiff(repoRoot)) {
      files.push(path.join(repoRoot, rel));
    }
  }

  return [...new Set(files)];
}

async function publishFile(repoRoot: string, filePath: string): Promise<boolean> {
  const sourceFile = path.relative(repoRoot, filePath).replace(/\\/g, "/");
  if (shouldSkipSource(sourceFile)) {
    console.log(`Skip (example/readme): ${sourceFile}`);
    return false;
  }

  const feed = loadFeed(repoRoot);
  const parsed = parseSocialFile(repoRoot, filePath);

  if (alreadyPublished(feed, parsed.sourceFile)) {
    console.log(`Skip (already published): ${parsed.sourceFile}`);
    return false;
  }

  console.log(`Publishing: ${parsed.sourceFile}`);
  console.log(`  X (${parsed.xBody.length} chars): ${parsed.xBody.slice(0, 80)}…`);

  const publishedAt = new Date().toISOString();
  const id = crypto.randomUUID();
  const siteUrl = `${SITE_URL}/social#${parsed.slug}`;

  let xResult: SocialFeedPost["x"] = null;
  let linkedinResult: SocialFeedPost["linkedin"] = null;

  if (isDryRun()) {
    console.log("  SOCIAL_DRY_RUN=1 — skipping live API calls");
    xResult = parsed.skipX
      ? null
      : { postId: "dry-run", url: "https://x.com/ilakkManoharan" };
    linkedinResult = parsed.skipLinkedin
      ? null
      : {
          postId: "dry-run",
          url: "https://linkedin.com/in/ilakkmanoharan",
        };
  } else {
    if (!parsed.skipX) {
      xResult = await postToX(parsed.xBody);
      console.log(`  Posted to X: ${xResult.url}`);
    }
    if (!parsed.skipLinkedin) {
      linkedinResult = await postToLinkedIn(parsed.linkedinBody);
      console.log(`  Posted to LinkedIn: ${linkedinResult.url}`);
    }
  }

  feed.posts.unshift({
    id,
    slug: parsed.slug,
    sourceFile: parsed.sourceFile,
    title: parsed.title,
    body: parsed.body,
    tags: parsed.tags,
    link: parsed.link,
    publishedAt,
    x: xResult,
    linkedin: linkedinResult,
    siteUrl,
  });

  saveFeed(repoRoot, feed);
  console.log(`  Added to site feed: ${siteUrl}`);
  return true;
}

async function main() {
  const repoRoot = process.cwd();
  const files = parseArgs(repoRoot);

  if (files.length === 0) {
    console.log("No social files to publish.");
    return;
  }

  let published = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`File not found: ${file}`);
      continue;
    }
    try {
      if (await publishFile(repoRoot, file)) {
        published++;
      }
    } catch (error) {
      console.error(`Failed: ${file}`);
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    }
  }

  console.log(`Done. ${published} new post(s) published.`);
}

main();
