import fs from "node:fs";
import path from "node:path";

export type HackathonSeed = {
  slug: string;
  hackathonName: string;
  projectName: string;
  problemAddressed: string;
  solutionSummary: string;
  datasetUsed: string | null;
  modelTech: string | null;
  technicalContribution: string;
  impact: string;
  githubUrl: string | null;
  kaggleUrl: string | null;
  demoVideo: string | null;
  writeupLink: string | null;
  statusResult: string;
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

/** Read `content/hackathons/*.md` relative to `cwd` (use `process.cwd()` from repo root). */
export function loadHackathonsFromMarkdown(cwd: string): HackathonSeed[] {
  const dir = path.join(cwd, "content", "hackathons");
  if (!fs.existsSync(dir)) {
    console.warn(`No hackathon markdown dir at ${dir}`);
    return [];
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  const rows: HackathonSeed[] = [];

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
    const hackathonName = fm.hackathonName;
    const projectName = fm.projectName;
    const problemAddressed = fm.problemAddressed;
    const solutionSummary = fm.solutionSummary;
    const technicalContribution = fm.technicalContribution;
    const impact = fm.impact;
    const statusResult = fm.statusResult;
    if (
      !hackathonName ||
      !projectName ||
      !problemAddressed ||
      !solutionSummary ||
      !technicalContribution ||
      !impact ||
      !statusResult
    ) {
      throw new Error(
        `${file}: frontmatter must include hackathonName, projectName, problemAddressed, solutionSummary, technicalContribution, impact, statusResult`,
      );
    }

    rows.push({
      slug,
      hackathonName,
      projectName,
      problemAddressed,
      solutionSummary,
      datasetUsed: emptyToNull(fm.datasetUsed),
      modelTech: emptyToNull(fm.modelTech),
      technicalContribution,
      impact,
      githubUrl: emptyToNull(fm.githubUrl),
      kaggleUrl: emptyToNull(fm.kaggleUrl),
      demoVideo: emptyToNull(fm.demoVideo),
      writeupLink: emptyToNull(fm.writeupLink),
      statusResult,
    });
  }

  return rows;
}
