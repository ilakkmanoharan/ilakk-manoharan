import fs from "node:fs";
import path from "node:path";

export type SocialFeedPost = {
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

export type SocialFeed = {
  version: number;
  posts: SocialFeedPost[];
};

const FEED_PATH = path.join(process.cwd(), "content", "social", "posts.json");

function readFeed(): SocialFeed {
  if (!fs.existsSync(FEED_PATH)) {
    return { version: 1, posts: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(FEED_PATH, "utf8")) as SocialFeed;
  } catch {
    return { version: 1, posts: [] };
  }
}

export function loadSocialPosts(): SocialFeedPost[] {
  const feed = readFeed();
  return [...feed.posts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function formatSocialDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  });
}

export function formatSocialDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
