import fs from "node:fs";
import path from "node:path";

export type FounderStudioSeed = {
  slug: string;
  title: string;
  category: string;
  youtubeId: string | null;
  summary: string;
  transcript: string;
  relatedProjectSlug: string | null;
  relatedSkills: string[];
  body: string;
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

/** Read `content/founder-studio/*.md` relative to `cwd` (use `process.cwd()` from repo root). */
export function loadFounderStudioFromMarkdown(cwd: string): FounderStudioSeed[] {
  const dir = path.join(cwd, "content", "founder-studio");
  if (!fs.existsSync(dir)) {
    console.warn(`No founder-studio markdown dir at ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const rows: FounderStudioSeed[] = [];

  for (const file of files.sort()) {
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
    const title = fm.title;
    const category = fm.category;
    const summary = fm.summary;
    if (!title || !category || !summary) {
      throw new Error(`${file}: frontmatter must include title, category, summary`);
    }

    let relatedSkills: string[] = [];
    try {
      relatedSkills = JSON.parse(fm.relatedSkills ?? "[]") as string[];
    } catch {
      throw new Error(`${file}: relatedSkills must be a valid JSON array`);
    }

    const transcript = body.trim() || summary;

    rows.push({
      slug,
      title,
      category,
      youtubeId: emptyToNull(fm.youtubeId),
      summary,
      transcript,
      relatedProjectSlug: emptyToNull(fm.relatedProjectSlug),
      relatedSkills,
      body,
    });
  }

  return rows;
}
