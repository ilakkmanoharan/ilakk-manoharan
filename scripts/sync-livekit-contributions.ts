#!/usr/bin/env tsx
/**
 * Sync LiveKit open-source contributions (PRs + issues authored by ilakkmanoharan)
 * into content/open-source/livekit-contributions.json for the projects page.
 *
 * Usage:
 *   npm run open-source:sync-livekit
 *
 * Uses GITHUB_TOKEN / GH_TOKEN when set; otherwise unauthenticated GitHub API
 * (lower rate limits). Preserves curated `detail` / `contribution` fields.
 */
import fs from "node:fs";
import path from "node:path";

const AUTHOR = "ilakkmanoharan";
const REPO = "livekit/agents";
const OUT = path.join(
  process.cwd(),
  "content",
  "open-source",
  "livekit-contributions.json",
);

type ContributionItem = {
  number: number;
  kind: "pull" | "issue";
  title: string;
  state: "open" | "closed" | "merged";
  url: string;
  createdAt: string;
  updatedAt: string;
  mergedAt: string | null;
  contribution: string;
  detail: string;
};

type LiveKitContributions = {
  slug: string;
  name: string;
  repo: string;
  repoUrl: string;
  projectPageUrl: string;
  blurb: string;
  focus: string;
  syncedAt: string;
  items: ContributionItem[];
};

const DEFAULT_NARRATIVE: Record<
  number,
  Pick<ContributionItem, "contribution" | "detail">
> = {
  8134: {
    contribution:
      "Separate NLTK coverage from hermetic tokenizer unit tests",
    detail:
      "Core tokenizer unit tests imported the optional NLTK plugin and could trigger a Punkt model download during collection. Moved NLTK batch and streaming coverage into dedicated plugin tests, prepared model data in an explicit fixture, shared the corpus through a dependency-free module, and updated CI and contributor docs. Verified 63 core tokenizer tests with networking blocked and NLTK imports disabled; both NLTK plugin tests passed; formatting, lint, and type checks passed.",
  },
  8433: {
    contribution:
      "Preserve shell environment when loading dotenv in TTS and realtime tests",
    detail:
      "Removed override=True from load_dotenv() in test_tts.py and test_realtime.py so a discovered .env cannot overwrite variables already set in the shell. Aligns with the pattern already used in test_stt.py. Fixes discussion in issue #8230.",
  },
  8230: {
    contribution:
      "Discuss removing dotenv environment mutation during TTS test collection",
    detail:
      "Opened after auditing import-time side effects following #8134. Reports that test_tts.py called load_dotenv(override=True) at module scope, which can replace intentional process environment values during collection. Proposes making dotenv preparation explicit without changing production behavior.",
  },
};

function authHeaders(): Record<string, string> {
  const token =
    process.env.GITHUB_TOKEN?.trim() || process.env.GH_TOKEN?.trim() || "";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "ilakk-manoharan-portfolio-livekit-sync",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${res.status} ${url}: ${body.slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

function firstParagraphs(body: string | null | undefined, max = 420): string {
  if (!body) return "";
  const cleaned = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<details>[\s\S]*?<\/details>/gi, " ")
    .replace(/[#>*_`\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

function loadExisting(): LiveKitContributions | null {
  if (!fs.existsSync(OUT)) return null;
  try {
    return JSON.parse(fs.readFileSync(OUT, "utf8")) as LiveKitContributions;
  } catch {
    return null;
  }
}

async function main() {
  type SearchItem = {
    number: number;
    title: string;
    state: string;
    html_url: string;
    created_at: string;
    updated_at: string;
    pull_request?: { url: string };
    body?: string | null;
  };

  const search = await ghJson<{ items: SearchItem[] }>(
    `https://api.github.com/search/issues?q=${encodeURIComponent(
      `author:${AUTHOR} repo:${REPO}`,
    )}&per_page=50&sort=created&order=desc`,
  );

  const existing = loadExisting();
  const byNumber = new Map(
    (existing?.items ?? []).map((item) => [item.number, item]),
  );

  const items: ContributionItem[] = [];
  for (const hit of search.items) {
    const isPull = Boolean(hit.pull_request);
    let mergedAt: string | null = null;
    let state: ContributionItem["state"] =
      hit.state === "open" ? "open" : "closed";
    let body = hit.body ?? "";

    if (isPull) {
      const pr = await ghJson<{
        state: string;
        merged_at: string | null;
        html_url: string;
        title: string;
        body: string | null;
        created_at: string;
        updated_at: string;
      }>(`https://api.github.com/repos/${REPO}/pulls/${hit.number}`);
      mergedAt = pr.merged_at;
      state = pr.merged_at ? "merged" : pr.state === "open" ? "open" : "closed";
      body = pr.body ?? body;
    }

    const prev = byNumber.get(hit.number);
    const defaults = DEFAULT_NARRATIVE[hit.number];
    const contribution =
      prev?.contribution ||
      defaults?.contribution ||
      hit.title.replace(/^(test|tests|fix):\s*/i, "");
    const detail =
      prev?.detail ||
      defaults?.detail ||
      firstParagraphs(body) ||
      hit.title;

    items.push({
      number: hit.number,
      kind: isPull ? "pull" : "issue",
      title: hit.title,
      state,
      url: hit.html_url,
      createdAt: hit.created_at,
      updatedAt: hit.updated_at,
      mergedAt,
      contribution,
      detail,
    });
  }

  items.sort((a, b) => b.number - a.number);

  const payload: LiveKitContributions = {
    slug: "livekit",
    name: "LiveKit",
    repo: REPO,
    repoUrl: `https://github.com/${REPO}`,
    projectPageUrl: "/projects/livekit",
    blurb:
      "Contributions focused on test reliability and the developer experience in livekit/agents.",
    focus:
      "Improving hermetic unit tests, making optional plugin and environment side effects explicit, and documenting contributor workflows.",
    syncedAt: new Date().toISOString(),
    items,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(
    `Wrote ${items.length} LiveKit contribution(s) → ${path.relative(process.cwd(), OUT)}`,
  );
  for (const item of items) {
    console.log(
      `  ${item.kind === "pull" ? "PR" : "Issue"} #${item.number} [${item.state}] ${item.title}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
