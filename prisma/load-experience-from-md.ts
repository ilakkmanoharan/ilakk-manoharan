import fs from "node:fs";
import path from "node:path";

export type ExperienceLink = {
  label: string;
  url: string;
};

export type ExperienceSeed = {
  slug: string;
  title: string;
  description: string;
  techStack: string[];
  role: string;
  status: string;
  githubUrl: string | null;
  websiteUrl: string | null;
  appStoreUrl: string | null;
  demoVideoUrl: string | null;
  caseStudyUrl: string | null;
  relatedLinks: ExperienceLink[];
  filterTags: string[];
  featured: boolean;
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

/** Read `content/experience/*.md` relative to `cwd`. */
export function loadExperienceFromMarkdown(cwd: string): ExperienceSeed[] {
  const dir = path.join(cwd, "content", "experience");
  if (!fs.existsSync(dir)) {
    console.warn(`No experience markdown dir at ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const rows: ExperienceSeed[] = [];

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
    const fmBlock = afterFirst.slice(0, endMarker).trim();
    const fm = parseSimpleYaml(fmBlock);

    const slug = fm.slug ?? path.basename(file, ".md");
    const title = fm.title;
    const description = fm.description;
    const role = fm.role;
    const status = fm.status;
    if (!title || !description || !role || !status) {
      throw new Error(
        `${file}: frontmatter must include title, description, role, status`,
      );
    }

    let filterTags: string[];
    let techStack: string[];
    let relatedLinks: ExperienceLink[];
    try {
      filterTags = JSON.parse(fm.filterTags ?? "[]") as string[];
      techStack = JSON.parse(fm.techStack ?? "[]") as string[];
      relatedLinks = JSON.parse(fm.relatedLinks ?? "[]") as ExperienceLink[];
    } catch {
      throw new Error(
        `${file}: filterTags, techStack, and relatedLinks must be valid JSON arrays`,
      );
    }

    const featured =
      fm.featured === "true" ||
      fm.featured === "1" ||
      fm.featured?.toLowerCase() === "yes";

    rows.push({
      slug,
      title,
      description,
      techStack,
      role,
      status,
      githubUrl: emptyToNull(fm.githubUrl),
      websiteUrl: emptyToNull(fm.websiteUrl),
      appStoreUrl: emptyToNull(fm.appStoreUrl),
      demoVideoUrl: emptyToNull(fm.demoVideoUrl),
      caseStudyUrl: emptyToNull(fm.caseStudyUrl),
      relatedLinks,
      filterTags,
      featured,
    });
  }

  return rows;
}
