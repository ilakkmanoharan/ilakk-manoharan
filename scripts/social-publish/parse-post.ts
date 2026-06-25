import fs from "node:fs";
import path from "node:path";

export type ParsedSocialPost = {
  slug: string;
  sourceFile: string;
  title: string | null;
  body: string;
  xBody: string;
  linkedinBody: string;
  tags: string[];
  link: string | null;
  skipX: boolean;
  skipLinkedin: boolean;
};

function slugFromPath(filePath: string): string {
  return path.basename(filePath, path.extname(filePath));
}

function parseSimpleYaml(yaml: string): Record<string, string | boolean | string[]> {
  const out: Record<string, string | boolean | string[]> = {};
  for (const line of yaml.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const colon = trimmed.indexOf(":");
    if (colon === -1) continue;
    const key = trimmed.slice(0, colon).trim();
    let value = trimmed.slice(colon + 1).trim();
    if (value.startsWith("[") && value.endsWith("]")) {
      out[key] = value
        .slice(1, -1)
        .split(",")
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ""))
        .filter(Boolean);
      continue;
    }
    if (value === "true") {
      out[key] = true;
      continue;
    }
    if (value === "false") {
      out[key] = false;
      continue;
    }
    out[key] = value.replace(/^['"]|['"]$/g, "");
  }
  return out;
}

function extractRecommendedSection(body: string): string {
  const markers = [
    "## Post (recommended — single post)",
    "## Post (recommended - single post)",
    "## Post (recommended)",
  ];
  for (const marker of markers) {
    const idx = body.indexOf(marker);
    if (idx === -1) continue;
    let rest = body.slice(idx + marker.length).replace(/^\s*\n/, "");
    const nextHr = rest.indexOf("\n---\n");
    if (nextHr !== -1) {
      rest = rest.slice(0, nextHr);
    }
    const nextH2 = rest.search(/\n## /);
    if (nextH2 !== -1) {
      rest = rest.slice(0, nextH2);
    }
    return rest.trim();
  }
  return body.trim();
}

function splitFrontmatter(raw: string): {
  frontmatter: Record<string, string | boolean | string[]>;
  body: string;
} {
  if (!raw.startsWith("---\n")) {
    return { frontmatter: {}, body: raw };
  }
  const end = raw.indexOf("\n---\n", 4);
  if (end === -1) {
    return { frontmatter: {}, body: raw };
  }
  return {
    frontmatter: parseSimpleYaml(raw.slice(4, end)),
    body: raw.slice(end + 5),
  };
}

function asString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function asTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string" && v.length > 0);
  }
  if (typeof value === "string" && value.trim()) {
    return value.split(/[\s,]+/).filter(Boolean);
  }
  return [];
}

export function shouldSkipSource(relativePath: string): boolean {
  const base = path.basename(relativePath);
  if (base === "README.md") return true;
  if (base.startsWith(".")) return true;
  if (base.includes(".dry-run.")) return true;
  if (base.startsWith("example-")) return true;
  return false;
}

export function parseSocialFile(
  repoRoot: string,
  absolutePath: string,
): ParsedSocialPost {
  const sourceFile = path.relative(repoRoot, absolutePath).replace(/\\/g, "/");
  const slug = slugFromPath(absolutePath);
  const ext = path.extname(absolutePath).toLowerCase();
  const raw = fs.readFileSync(absolutePath, "utf8");

  if (ext === ".json") {
    const card = JSON.parse(raw) as {
      title?: string;
      body?: string;
      x_body?: string;
      linkedin_body?: string;
      tags?: string[];
      link?: string;
      skip_x?: boolean;
      skip_linkedin?: boolean;
    };
    const body = (card.body ?? "").trim();
    if (!body) {
      throw new Error(`${sourceFile}: JSON card requires a non-empty "body"`);
    }
    return {
      slug,
      sourceFile,
      title: card.title?.trim() ?? null,
      body,
      xBody: (card.x_body ?? body).trim(),
      linkedinBody: (card.linkedin_body ?? body).trim(),
      tags: card.tags ?? [],
      link: card.link?.trim() ?? null,
      skipX: card.skip_x === true,
      skipLinkedin: card.skip_linkedin === true,
    };
  }

  if (ext !== ".md") {
    throw new Error(`${sourceFile}: unsupported extension (use .md or .json)`);
  }

  const { frontmatter, body: rawBody } = splitFrontmatter(raw);
  const body = extractRecommendedSection(rawBody);
  if (!body) {
    throw new Error(`${sourceFile}: empty post body`);
  }

  const xBody = asString(frontmatter.x_body) ?? body;
  const linkedinBody = asString(frontmatter.linkedin_body) ?? body;

  return {
    slug,
    sourceFile,
    title: asString(frontmatter.title),
    body,
    xBody,
    linkedinBody,
    tags: asTags(frontmatter.tags),
    link: asString(frontmatter.link),
    skipX: frontmatter.skip_x === true,
    skipLinkedin: frontmatter.skip_linkedin === true,
  };
}
