import type { AgentClaim } from "@/lib/agent/types";
import type { KnowledgeNode } from "@/lib/agent/sync-knowledge";

const DEFAULT_PAGES = [
  "/",
  "/projects",
  "/startups",
  "/hackathons",
  "/founder-studio",
  "/skills",
  "/skills/projects",
  "/talks",
  "/recruiter",
  "/exceptional-ability",
  "/agent",
  "/asra",
  "/nfm",
  "/schedule",
  "/contact",
];

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "home";
}

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function splitChunks(text: string, maxLen = 400) {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let buf = "";
  for (const s of sentences) {
    if (!s.trim()) continue;
    if ((buf + " " + s).trim().length > maxLen && buf.length > 80) {
      chunks.push(buf.trim());
      buf = s;
    } else {
      buf = buf ? `${buf} ${s}` : s;
    }
  }
  if (buf.trim().length > 80) chunks.push(buf.trim());
  return chunks.slice(0, 12);
}

function makeClaim(
  id: string,
  text: string,
  topics: string[],
  sources: string[],
): AgentClaim {
  return {
    id,
    text,
    topics: [...new Set(topics.map((t) => t.toLowerCase()))],
    sources: [...new Set(sources)],
    origin: "page",
    verified: true,
    lastSynced: new Date().toISOString().slice(0, 10),
  };
}

/** Fetch public production pages and extract text claims (supplements git-backed sync). */
export async function buildLiveSiteClaims(
  siteUrl = "https://ilakk-manoharan.vercel.app",
  pages: string[] = DEFAULT_PAGES,
): Promise<{ claims: AgentClaim[]; nodes: KnowledgeNode[] }> {
  const claims: AgentClaim[] = [];
  const nodes: KnowledgeNode[] = [];
  const base = siteUrl.replace(/\/$/, "");

  for (const page of pages) {
    const url = page === "/" ? base : `${base}${page.startsWith("/") ? page : `/${page}`}`;
    const slug = slugify(page === "/" ? "home" : page);

    let html: string;
    try {
      const res = await fetch(url, {
        headers: { Accept: "text/html", "User-Agent": "IlakKnowledgeSync/1.0" },
        signal: AbortSignal.timeout(30_000),
      });
      if (!res.ok) continue;
      html = await res.text();
    } catch {
      continue;
    }

    const text = htmlToText(html);
    if (text.length < 120) continue;

    const claimIds: string[] = [];
    for (const [i, chunk] of splitChunks(text).entries()) {
      const id = `claim-auto-live-${slug}-p${i + 1}`;
      claims.push(
        makeClaim(
          id,
          chunk,
          [slug, "live site", "portfolio", page.replace(/\//g, " ")],
          [url],
        ),
      );
      claimIds.push(id);
    }

    if (claimIds.length) {
      nodes.push({
        id: `node-live-${slug}`,
        type: "page",
        title: `Live site: ${page}`,
        url,
        claimIds,
      });
    }
  }

  return { claims, nodes };
}

export { DEFAULT_PAGES };
