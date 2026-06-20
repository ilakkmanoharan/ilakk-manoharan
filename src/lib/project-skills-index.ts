import { loadProjectsFromMarkdown } from "../../prisma/load-projects-from-md";
import { loadSkillsFromMarkdown } from "../../prisma/load-skills-from-md";

export type ProjectSkillLink = {
  slug: string;
  title: string;
  status: string;
  evidence: string[];
  projectUrl: string;
};

export type SkillProjectGroup = {
  skillId: string;
  skillLabel: string;
  category: string;
  yearsExperience: number | null;
  skillPageUrl: string;
  projects: ProjectSkillLink[];
};

export type SkillsProjectIndex = {
  skills: SkillProjectGroup[];
  projectCount: number;
  skillCount: number;
};

/** Canonical skills with aliases for query matching and tech/tag mapping. */
const SKILL_REGISTRY: {
  id: string;
  label: string;
  category: string;
  aliases: string[];
  tags: string[];
  techKeywords: string[];
}[] = [
  {
    id: "machine-learning",
    label: "Machine Learning",
    category: "AI / ML Systems",
    aliases: ["ml", "machine learning", "ai/ml", "ai ml", "deep learning"],
    tags: ["AI / ML", "Scientific AI"],
    techKeywords: [
      "python",
      "pytorch",
      "tensorflow",
      "scikit-learn",
      "sklearn",
      "gaussian",
      "forward simulation",
      "heuristic search",
      "game ai",
      "tf-idf",
      "retrieval",
      "agent",
      "mcp",
      "onnx",
      "neural circuit",
      "program synthesis",
      "neurogolf",
      "arc-genome",
      "minimum description length",
      "agent security",
      "red teaming",
      "go-explore",
      "tool-using agents",
    ],
  },
  {
    id: "backend",
    label: "Backend Engineering",
    category: "Backend Engineering",
    aliases: ["backend", "back-end", "api", "apis", "microservices", "server"],
    tags: ["Backend"],
    techKeywords: [
      "express",
      "fastapi",
      "node.js",
      "nodejs",
      "prisma",
      "pydantic",
      "websocket",
      "postgresql",
      "firestore",
      "turso",
    ],
  },
  {
    id: "full-stack",
    label: "Full Stack Development",
    category: "Full Stack Development",
    aliases: ["full stack", "full-stack", "fullstack", "end-to-end"],
    tags: ["Full Stack"],
    techKeywords: ["next.js", "react", "typescript", "tailwind"],
  },
  {
    id: "cloud",
    label: "Cloud Infrastructure",
    category: "Cloud Infrastructure",
    aliases: [
      "cloud",
      "aws",
      "amazon web services",
      "vercel",
      "firebase",
      "serverless",
      "cloud-native",
      "deployment",
    ],
    tags: ["Cloud"],
    techKeywords: [
      "vercel",
      "firebase",
      "firestore",
      "turso",
      "cloud-native",
      "iot",
      "edge ai",
      "distributed services",
    ],
  },
  {
    id: "distributed-systems",
    label: "Distributed Systems",
    category: "Distributed Systems",
    aliases: ["distributed systems", "distributed", "real-time", "websocket"],
    tags: ["Distributed Systems"],
    techKeywords: ["websocket", "distributed", "mcp", "multi-agent"],
  },
  {
    id: "mobile",
    label: "Mobile Development",
    category: "Mobile Development",
    aliases: ["mobile", "ios", "android", "swift", "kotlin"],
    tags: ["Mobile"],
    techKeywords: ["swiftui", "kotlin", "jetpack compose", "app store", "sqlite"],
  },
  {
    id: "scientific-ai",
    label: "Scientific AI",
    category: "Scientific AI",
    aliases: [
      "scientific ai",
      "research",
      "asra",
      "nfm",
      "nature foundation",
      "decision biology",
      "world models",
    ],
    tags: ["Scientific AI"],
    techKeywords: ["asra", "nfm", "atlas-gs", "scilayer", "orcid", "preprint"],
  },
  {
    id: "databases",
    label: "Databases",
    category: "Databases",
    aliases: ["database", "databases", "sql", "postgres", "data layer"],
    tags: [],
    techKeywords: [
      "postgresql",
      "postgres",
      "prisma",
      "firestore",
      "turso",
      "sqlite",
      "sql",
    ],
  },
  {
    id: "open-source",
    label: "Open Source",
    category: "Engineering",
    aliases: ["open source", "opensource", "github"],
    tags: ["Open Source"],
    techKeywords: ["github", "open source"],
  },
  {
    id: "python",
    label: "Python",
    category: "Languages",
    aliases: ["python", "py"],
    tags: [],
    techKeywords: ["python", "fastapi", "pymupdf", "pydantic"],
  },
  {
    id: "typescript",
    label: "TypeScript",
    category: "Languages",
    aliases: ["typescript", "ts", "javascript", "js"],
    tags: [],
    techKeywords: ["typescript", "react", "next.js", "node.js", "vite"],
  },
  {
    id: "payments",
    label: "Payments & Commerce",
    category: "Product Engineering",
    aliases: ["stripe", "payments", "e-commerce", "ecommerce", "checkout"],
    tags: [],
    techKeywords: ["stripe", "checkout", "e-commerce"],
  },
  {
    id: "iot",
    label: "IoT & Edge",
    category: "Cloud Infrastructure",
    aliases: ["iot", "edge", "edge ai", "embedded"],
    tags: [],
    techKeywords: ["iot", "edge ai", "cloud-native iot"],
  },
];

const SITE = "https://ilakk-manoharan.vercel.app";

function normalizeToken(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9+/ ]/g, " ").replace(/\s+/g, " ").trim();
}

function projectMatchesSkill(
  filterTags: string[],
  techStack: string[],
  skill: (typeof SKILL_REGISTRY)[number],
): string[] {
  const evidence: string[] = [];
  const tagsLc = filterTags.map((t) => normalizeToken(t));
  const stackLc = techStack.map((t) => normalizeToken(t));

  for (const tag of skill.tags) {
    const n = normalizeToken(tag);
    if (tagsLc.some((t) => t === n || t.includes(n))) {
      evidence.push(`filter tag: ${tag}`);
    }
  }

  for (const kw of skill.techKeywords) {
    const n = normalizeToken(kw);
    for (const item of stackLc) {
      if (item.includes(n) || n.includes(item)) {
        evidence.push(`stack: ${techStack[stackLc.indexOf(item)] ?? item}`);
        break;
      }
    }
  }

  return [...new Set(evidence)];
}

export function buildSkillsProjectIndex(cwd = process.cwd()): SkillsProjectIndex {
  const projects = loadProjectsFromMarkdown(cwd);
  const formalSkills = loadSkillsFromMarkdown(cwd);
  const formalByCategory = new Map(
    formalSkills.map((s) => [normalizeToken(s.category), s]),
  );

  const skills: SkillProjectGroup[] = SKILL_REGISTRY.map((skill) => {
    const formal =
      formalSkills.find((s) => normalizeToken(s.name) === normalizeToken(skill.label)) ??
      formalByCategory.get(normalizeToken(skill.category)) ??
      null;

    const linked: ProjectSkillLink[] = [];

    for (const p of projects) {
      const evidence = projectMatchesSkill(p.filterTags, p.techStack, skill);
      if (evidence.length === 0) continue;
      linked.push({
        slug: p.slug,
        title: p.title,
        status: p.status,
        evidence,
        projectUrl: `${SITE}/projects#${p.slug}`,
      });
    }

    return {
      skillId: skill.id,
      skillLabel: skill.label,
      category: skill.category,
      yearsExperience: formal?.yearsExperience ?? null,
      skillPageUrl: formal
        ? `${SITE}/skills/${formal.slug}`
        : `${SITE}/skills/projects#${skill.id}`,
      projects: linked.sort((a, b) => a.title.localeCompare(b.title)),
    };
  }).filter((g) => g.projects.length > 0);

  return {
    skills: skills.sort((a, b) => a.skillLabel.localeCompare(b.skillLabel)),
    projectCount: projects.length,
    skillCount: skills.length,
  };
}

export function listAllSkillLabels(): { id: string; label: string; aliases: string[] }[] {
  return SKILL_REGISTRY.map((s) => ({
    id: s.id,
    label: s.label,
    aliases: [s.label, ...s.aliases],
  }));
}

/** Resolve a skill from a natural-language question. */
export function resolveSkillFromQuery(question: string): (typeof SKILL_REGISTRY)[number] | null {
  const q = normalizeToken(question);
  if (!q) return null;

  let best: (typeof SKILL_REGISTRY)[number] | null = null;
  let bestLen = 0;

  for (const skill of SKILL_REGISTRY) {
    const candidates = [skill.label, ...skill.aliases].map(normalizeToken);
    for (const c of candidates) {
      if (c.length < 2) continue;
      if (q.includes(c) && c.length > bestLen) {
        best = skill;
        bestLen = c.length;
      }
    }
  }

  return best;
}

export function isSkillQuestion(question: string): boolean {
  const q = question.toLowerCase();

  // Lazy import avoided — duplicate minimal check to keep this module leaf-free.
  const isDefinition =
    /\b(what is|what are|what's|explain|tell me about|describe|overview of|define)\b/.test(
      q,
    ) &&
    /\b(nfm|nature foundation models?|asra|atlas-gs|decision biology|orbit wars|arc-genome|neurogolf|scilayer|researchgraph)\b/.test(
      q,
    );
  if (isDefinition) return false;

  const skill = resolveSkillFromQuery(question);
  if (skill) {
    const skillIntent =
      /\b(does|do|can|has|have|know)\b.*\b(ilak|he|she)\b/i.test(q) ||
      /\b(skill|experience|background)\b/i.test(q) ||
      /\bprojects?\b.*\b(with|involving|using|for)\b/i.test(q) ||
      /\b(which|what|list|pull|show)\b.*\bprojects?\b/i.test(q);
    if (skillIntent) return true;
    return false;
  }

  return (
    /\b(does|do|can|has|have|know)\b.*\b(ilak|he|she)\b.*\b(skill|experience|background)\b/i.test(
      q,
    ) ||
    /\bprojects?\b.*\b(with|involving|using|for)\b/i.test(q) ||
    /\b(skill|experience)\b.*\b(in|with|for)\b/i.test(q)
  );
}

export function getProjectsForSkillQuery(
  question: string,
  cwd = process.cwd(),
): SkillProjectGroup | null {
  const skill = resolveSkillFromQuery(question);
  if (!skill) return null;
  const index = buildSkillsProjectIndex(cwd);
  return index.skills.find((s) => s.skillId === skill.id) ?? null;
}
