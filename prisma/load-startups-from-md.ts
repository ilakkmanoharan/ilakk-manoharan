import fs from "node:fs";
import path from "node:path";

export type StartupSeed = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  targetUsers: string;
  status: string;
  websiteUrl: string | null;
  githubUrl: string | null;
  youtubeUrl: string | null;
  pitchDeckUrl: string | null;
  theoryUrl: string | null;
  body: string;
};

const DEFAULT_PITCH_DECK_BY_SLUG: Record<string, string> = {
  "nature-foundation-models": "/startup-catalog/Nature-Foundation-Models-v9.pdf",
  agentapply: "/startup-catalog/AgentApply.pdf",
  "finance-autopilot": "/startup-catalog/Finance-Autopilot-v2.pdf",
};

function emptyToNull(v: string | undefined): string | null {
  if (v === undefined || v === null) return null;
  const t = v.trim();
  return t.length === 0 ? null : t;
}

function parseSimpleYaml(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1).replace(/\\n/g, "\n");
    }
    out[m[1]] = val;
  }
  return out;
}

/** Read `content/startups/*.md` relative to `cwd` (use `process.cwd()` from repo root). */
export function loadStartupsFromMarkdown(
  cwd: string,
  options?: { publicCatalogOnly?: boolean },
): StartupSeed[] {
  const dir = path.join(cwd, "content", "startups");
  if (!fs.existsSync(dir)) {
    console.warn(`No startup markdown dir at ${dir}`);
    return [];
  }

  const startups = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8").trimStart();
      if (!raw.startsWith("---")) {
        throw new Error(`${file}: expected YAML frontmatter starting with ---`);
      }
      const afterFirst = raw.slice(3).replace(/^\r?\n/, "");
      const endMarker = afterFirst.search(/\r?\n---\r?\n/);
      if (endMarker === -1) {
        throw new Error(`${file}: missing closing --- frontmatter delimiter`);
      }
      const fm = parseSimpleYaml(afterFirst.slice(0, endMarker).trim());
      const body = afterFirst.slice(endMarker + 4).trim();
      const slug = fm.slug ?? path.basename(file, ".md");

      return {
        slug,
        name: fm.name ?? slug,
        tagline: fm.tagline ?? "",
        description: fm.description ?? "",
        problem: fm.problem ?? "",
        solution: fm.solution ?? "",
        targetUsers: fm.targetUsers ?? "",
        status: fm.status ?? "",
        websiteUrl: emptyToNull(fm.websiteUrl),
        githubUrl: emptyToNull(fm.githubUrl),
        youtubeUrl: emptyToNull(fm.youtubeUrl),
        pitchDeckUrl:
          emptyToNull(fm.pitchDeckUrl) ??
          DEFAULT_PITCH_DECK_BY_SLUG[slug] ??
          null,
        theoryUrl: emptyToNull(fm.theoryUrl),
        body,
        sortOrder: (() => {
          const parsed = Number.parseInt(fm.sortOrder ?? "999", 10);
          return Number.isNaN(parsed) ? 999 : parsed;
        })(),
        visible: fm.visible !== "false",
      };
    })
    .filter((s) => !options?.publicCatalogOnly || s.visible)
    .sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));

  return startups.map(({ sortOrder: _sortOrder, visible: _visible, ...startup }) => startup);
}
