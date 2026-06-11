import fs from "node:fs";
import path from "node:path";
import { isIlakSciLayerAuthor } from "@/lib/agent/scilayer-authors";

export type SciLayerArticle = {
  slug: string;
  title: string;
  abstract: string;
  keywords: string[];
  manuscript: string;
  articleUrl: string;
  githubUrl?: string;
};

const SCILAYER_SITE = "https://sci-layer.vercel.app";
const SCILAYER_REPO = "https://github.com/ilakkmanoharan/SciLayer/tree/main/content";
const RAW_BASE =
  "https://raw.githubusercontent.com/ilakkmanoharan/SciLayer/main/content/articles";

export function scilayerArticlesDir(cwd = process.cwd()) {
  return path.join(cwd, "content", "scilayer", "articles");
}

function pickManuscriptFile(files: string[]) {
  if (files.includes("manuscript-v2.md")) return "manuscript-v2.md";
  if (files.includes("manuscript.md")) return "manuscript.md";
  if (files.includes("manuscript-v1.md")) return "manuscript-v1.md";
  return files.find((f) => f.startsWith("manuscript") && f.endsWith(".md"));
}

function readLocalArticle(slug: string, cwd: string): SciLayerArticle | null {
  const dir = path.join(scilayerArticlesDir(cwd), slug);
  const metaPath = path.join(dir, "metadata.json");
  if (!fs.existsSync(metaPath)) return null;

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
    slug?: string;
    title?: string;
    abstract?: string;
    keywords?: string[];
    manuscriptFile?: string;
    githubUrl?: string;
    authors?: { name?: string; orcid?: string }[];
  };

  if (!isIlakSciLayerAuthor(meta.authors)) return null;

  const manuscriptFile =
    meta.manuscriptFile ??
    pickManuscriptFile(fs.readdirSync(dir).filter((f) => f.endsWith(".md")));
  if (!manuscriptFile) return null;

  const manuscriptPath = path.join(dir, manuscriptFile);
  if (!fs.existsSync(manuscriptPath)) return null;

  return {
    slug: meta.slug ?? slug,
    title: meta.title ?? slug,
    abstract: meta.abstract ?? "",
    keywords: meta.keywords ?? [],
    manuscript: fs.readFileSync(manuscriptPath, "utf8"),
    articleUrl: `${SCILAYER_SITE}/articles/${slug}`,
    githubUrl: meta.githubUrl,
  };
}

export function loadSciLayerArticlesFromDisk(cwd = process.cwd()): SciLayerArticle[] {
  const root = scilayerArticlesDir(cwd);
  if (!fs.existsSync(root)) return [];

  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => readLocalArticle(d.name, cwd))
    .filter((a): a is SciLayerArticle => a !== null);
}

async function listRemoteArticleSlugs(): Promise<string[]> {
  const res = await fetch(
    "https://api.github.com/repos/ilakkmanoharan/SciLayer/contents/content/articles?ref=main",
  );
  if (!res.ok) throw new Error(`SciLayer article list failed: ${res.status}`);
  const data = (await res.json()) as { name: string; type: string }[];
  return data.filter((e) => e.type === "dir").map((e) => e.name);
}

async function fetchRemoteFile(url: string): Promise<string | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

export async function fetchAndCacheSciLayerArticles(cwd = process.cwd()) {
  const slugs = await listRemoteArticleSlugs();
  const root = scilayerArticlesDir(cwd);
  fs.mkdirSync(root, { recursive: true });

  const articles: SciLayerArticle[] = [];

  for (const slug of slugs) {
    const dir = path.join(root, slug);
    fs.mkdirSync(dir, { recursive: true });

    const metaRaw = await fetchRemoteFile(`${RAW_BASE}/${slug}/metadata.json`);
    if (!metaRaw) continue;

    fs.writeFileSync(path.join(dir, "metadata.json"), metaRaw);
    const meta = JSON.parse(metaRaw) as {
      title?: string;
      abstract?: string;
      keywords?: string[];
      manuscriptFile?: string;
      githubUrl?: string;
      authors?: { name?: string; orcid?: string }[];
    };

    if (!isIlakSciLayerAuthor(meta.authors)) continue;

    const listRes = await fetch(
      `https://api.github.com/repos/ilakkmanoharan/SciLayer/contents/content/articles/${slug}?ref=main`,
    );
    const entries = listRes.ok
      ? ((await listRes.json()) as { name: string }[])
      : [];
    const mdFiles = entries.map((e) => e.name).filter((n) => n.endsWith(".md"));
    const manuscriptFile =
      meta.manuscriptFile ?? pickManuscriptFile(mdFiles) ?? "manuscript.md";

    const manuscriptRaw = await fetchRemoteFile(
      `${RAW_BASE}/${slug}/${manuscriptFile}`,
    );
    if (!manuscriptRaw) continue;

    fs.writeFileSync(path.join(dir, manuscriptFile), manuscriptRaw);

    articles.push({
      slug,
      title: meta.title ?? slug,
      abstract: meta.abstract ?? "",
      keywords: meta.keywords ?? [],
      manuscript: manuscriptRaw,
      articleUrl: `${SCILAYER_SITE}/articles/${slug}`,
      githubUrl: meta.githubUrl,
    });
  }

  fs.writeFileSync(
    path.join(cwd, "content", "scilayer", "manifest.json"),
    `${JSON.stringify(
      {
        syncedAt: new Date().toISOString(),
        source: SCILAYER_REPO,
        articleCount: articles.length,
        slugs: articles.map((a) => a.slug),
      },
      null,
      2,
    )}\n`,
  );

  return articles;
}
