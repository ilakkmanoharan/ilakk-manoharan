import fs from "node:fs";
import path from "node:path";

export type SkillExperienceSeed = {
  organization: string;
  role: string;
  summary: string;
  startYear: number | null;
  endYear: number | null;
};

export type SkillSeed = {
  slug: string;
  name: string;
  category: string;
  overview: string;
  yearsExperience: number;
  tools: string[];
  examples: string[];
  videoUrls: string[];
  githubLinks: string[];
  experiences: SkillExperienceSeed[];
  body: string;
};

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

function parseJsonArray<T>(raw: string | undefined, field: string, file: string): T[] {
  try {
    const parsed = JSON.parse(raw ?? "[]") as unknown;
    if (!Array.isArray(parsed)) {
      throw new Error("expected JSON array");
    }
    return parsed as T[];
  } catch {
    throw new Error(`${file}: ${field} must be a valid JSON array`);
  }
}

/** Read `content/skills/*.md` relative to `cwd` (use `process.cwd()` from repo root). */
export function loadSkillsFromMarkdown(cwd: string): SkillSeed[] {
  const dir = path.join(cwd, "content", "skills");
  if (!fs.existsSync(dir)) {
    console.warn(`No skills markdown dir at ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const rows: SkillSeed[] = [];

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
    const name = fm.name;
    const category = fm.category;
    const overview = fm.overview;
    const yearsExperience = Number(fm.yearsExperience);
    if (!name || !category || !overview || !Number.isFinite(yearsExperience)) {
      throw new Error(
        `${file}: frontmatter must include name, category, overview, yearsExperience`,
      );
    }

    rows.push({
      slug,
      name,
      category,
      overview,
      yearsExperience,
      tools: parseJsonArray<string>(fm.tools, "tools", file),
      examples: parseJsonArray<string>(fm.examples, "examples", file),
      videoUrls: parseJsonArray<string>(fm.videoUrls, "videoUrls", file),
      githubLinks: parseJsonArray<string>(fm.githubLinks, "githubLinks", file),
      experiences: parseJsonArray<SkillExperienceSeed>(
        fm.experiences,
        "experiences",
        file,
      ),
      body,
    });
  }

  return rows;
}
