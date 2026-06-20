import { loadClaimsGraph } from "@/lib/agent/knowledge";
import { isNfmQuestion } from "@/lib/agent/query-intent";
import type { RetrievedClaim } from "@/lib/agent/types";
import {
  getProjectsForSkillQuery,
  isSkillQuestion,
  resolveSkillFromQuery,
} from "@/lib/project-skills-index";

const SKIP_LINE_PATTERNS = [
  /^Why this supports exceptional ability:/i,
  /^Ilakkuvaselvi Manoharan \(20\d\d\)\./,
  /^Contribution:/i,
  /^Version \d+ \(20\d\d\):/i,
  /^Batch evaluation:/i,
  /^Milestones 3A/i,
  /^I designed the Phase \d+ theory/i,
  /^I designed Phase \d+ theory/i,
];

const PHASE_IMPLEMENTATION =
  /designed and implemented ASRA Phase (\d+)/i;

function extractImplementedPhase(text: string): number | null {
  const m = text.match(PHASE_IMPLEMENTATION);
  return m ? Number.parseInt(m[1], 10) : null;
}

function shouldSkipClaim(text: string) {
  const trimmed = text.trim();
  return SKIP_LINE_PATTERNS.some((p) => p.test(trimmed));
}

function isArcAsraQuestion(question: string, matches: RetrievedClaim[]) {
  const q = question.toLowerCase();
  if (/\b(arc|asra|agi-3|arc-agi|kaggle)\b/.test(q)) return true;
  return (
    matches.filter((m) => /ASRA Phase|ARC Prize|ARC-AGI/i.test(m.text)).length >= 2
  );
}

function dedupeClaims(matches: RetrievedClaim[]) {
  const seen = new Set<string>();
  return matches.filter((m) => {
    const key = m.text.trim().slice(0, 120);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function stripStructuredLabel(text: string) {
  const dashSolution = text.indexOf("— Solution:");
  if (dashSolution !== -1) {
    return text.slice(dashSolution + "— Solution:".length).trim();
  }
  const solution = text.indexOf("Solution:");
  if (solution !== -1) {
    return text.slice(solution + "Solution:".length).trim();
  }
  return text.trim();
}

const ARC_NARRATIVE_CLAIM_IDS = new Set([
  "claim-auto-hackathon-asra-solution",
  "claim-auto-scilayer-transition-centric-adaptive-reasoning-asra-phase-1-abstract",
  "claim-auto-evidence-11-b1",
]);

function augmentArcMatches(matches: RetrievedClaim[]): RetrievedClaim[] {
  const byId = new Map(matches.map((m) => [m.id, m]));
  const graph = loadClaimsGraph();
  for (const c of graph.claims) {
    if (!ARC_NARRATIVE_CLAIM_IDS.has(c.id) && !PHASE_IMPLEMENTATION.test(c.text)) {
      continue;
    }
    if (!byId.has(c.id)) {
      byId.set(c.id, { ...c, score: 1 });
    }
  }
  return [...byId.values()];
}

const NFM_NARRATIVE_CLAIM_IDS = new Set([
  "claim-auto-startup-nature-foundation-models-p1",
  "claim-auto-startup-nature-foundation-models-overview",
  "claim-auto-startup-nature-foundation-models-p2",
  "claim-auto-startup-nature-foundation-models-solution",
  "claim-auto-startup-nature-foundation-models-p3",
]);

function augmentNfmMatches(matches: RetrievedClaim[]): RetrievedClaim[] {
  const byId = new Map(matches.map((m) => [m.id, m]));
  const graph = loadClaimsGraph();
  for (const c of graph.claims) {
    if (!NFM_NARRATIVE_CLAIM_IDS.has(c.id)) continue;
    if (!byId.has(c.id)) {
      byId.set(c.id, { ...c, score: 1 });
    }
  }
  return [...byId.values()];
}

function composeNfmNarrative(matches: RetrievedClaim[]): string {
  const augmented = augmentNfmMatches(matches);
  const filtered = dedupeClaims(augmented).filter((m) => !shouldSkipClaim(m.text));

  const intro =
    filtered.find((m) => m.id === "claim-auto-startup-nature-foundation-models-p1") ??
    filtered.find((m) =>
      /long-term bet on AI infrastructure for scientific intelligence/i.test(m.text),
    );

  const overview =
    filtered.find((m) => m.id === "claim-auto-startup-nature-foundation-models-overview") ??
    filtered.find((m) =>
      /Foundation models for natural systems/i.test(m.text),
    );

  const hierarchy =
    filtered.find((m) => m.id === "claim-auto-startup-nature-foundation-models-p2");

  const solution =
    filtered.find((m) => m.id === "claim-auto-startup-nature-foundation-models-solution");

  const wedge =
    filtered.find((m) => m.id === "claim-auto-startup-nature-foundation-models-p3");

  const parts: string[] = [];
  if (overview) parts.push(overview.text);
  else if (intro) parts.push(intro.text);
  if (hierarchy) parts.push(hierarchy.text);
  if (solution) parts.push(solution.text);
  else if (wedge) parts.push(wedge.text);

  if (parts.length === 0) {
    return composeGenericNarrative(filtered);
  }

  parts.push(
    "More: https://ilakk-manoharan.vercel.app/nfm · Program site: https://nature-foundation-models.vercel.app",
  );
  return parts.join("\n\n");
}

function composeArcNarrative(matches: RetrievedClaim[]): string {
  const augmented = augmentArcMatches(matches);
  const filtered = dedupeClaims(augmented).filter((m) => !shouldSkipClaim(m.text));

  const intro =
    filtered.find((m) => m.id === "claim-auto-hackathon-asra-solution") ??
    filtered.find(
      (m) =>
        /ASRA \(Adaptive Scientific Reasoning Architecture\)/i.test(m.text) &&
        /intervention-centric scientific reasoning/i.test(m.text),
    );

  const phase1 =
    filtered.find(
      (m) =>
        m.id ===
        "claim-auto-scilayer-transition-centric-adaptive-reasoning-asra-phase-1-abstract",
    ) ??
    filtered.find((m) =>
      /ASRA Phase 1 is a minimal agent architecture for fluid reasoning/i.test(
        m.text,
      ),
    );

  const phaseImplementations = filtered
    .filter((m) => PHASE_IMPLEMENTATION.test(m.text))
    .sort(
      (a, b) =>
        (extractImplementedPhase(a.text) ?? 99) -
        (extractImplementedPhase(b.text) ?? 99),
    );

  const seenPhases = new Set<number>();
  const orderedPhases = phaseImplementations.filter((c) => {
    const phase = extractImplementedPhase(c.text);
    if (!phase || phase === 1 || seenPhases.has(phase)) return false;
    seenPhases.add(phase);
    return true;
  });

  const roadmap =
    filtered.find((m) => m.id === "claim-auto-evidence-11-b1") ??
    filtered.find((m) =>
      /Phase 1 Experience Engine → Phase 2 Observation Engine → Phase 3 Navigation & Memory Engine → Phase 4/i.test(
        m.text,
      ),
    );

  if (phase1 || orderedPhases.length >= 2) {
    const parts: string[] = [];

    if (intro) parts.push(stripStructuredLabel(intro.text));

    if (phase1) parts.push(phase1.text);

    parts.push(...orderedPhases.map((c) => c.text));

    if (roadmap) parts.push(roadmap.text);

    return parts.join("\n\n");
  }

  return composeGenericNarrative(filtered);
}

function composeGenericNarrative(matches: RetrievedClaim[]): string {
  const filtered = dedupeClaims(matches).filter((m) => !shouldSkipClaim(m.text));
  return filtered.slice(0, 5).map((m) => m.text).join("\n\n");
}

function composeSkillNarrative(question: string, matches: RetrievedClaim[]): string {
  const group = getProjectsForSkillQuery(question);
  const skill = resolveSkillFromQuery(question);
  const skillClaims = matches.filter(
    (m) =>
      m.id.startsWith("claim-auto-skill-has-") ||
      m.id.startsWith("claim-auto-skill-projects-"),
  );

  if (group && group.projects.length > 0) {
    const years =
      group.yearsExperience != null
        ? ` Ilak lists ${group.yearsExperience}+ years of ${group.skillLabel} experience on the skills page.`
        : "";
    const projectList = group.projects
      .map(
        (p) =>
          `• ${p.title} (${p.status}) — ${p.evidence.slice(0, 2).join("; ")}`,
      )
      .join("\n");

    const askingProjects =
      /\bprojects?\b.*\b(with|involving|using|for)\b/i.test(question) ||
      /\b(which|what|list|pull|show)\b.*\bprojects?\b/i.test(question);

    if (askingProjects) {
      return `Projects involving ${group.skillLabel}:\n\n${projectList}\n\nFull skill ↔ project index: https://ilakk-manoharan.vercel.app/skills/projects#${group.skillId}`;
    }

    return `Yes — Ilak has ${group.skillLabel} skill.${years}\n\nDemonstrated in:\n${projectList}\n\nMore detail: https://ilakk-manoharan.vercel.app/skills/projects#${group.skillId}`;
  }

  if (skillClaims.length > 0) {
    return skillClaims.map((m) => m.text).join("\n\n");
  }

  if (skill) {
    return `I don't have a mapped project for "${skill.label}" in the verified index yet. See https://ilakk-manoharan.vercel.app/skills/projects for the full skill map, or https://ilakk-manoharan.vercel.app/skills for experience pages.`;
  }

  return composeGenericNarrative(matches);
}

export function composeAnswer(question: string, matches: RetrievedClaim[]): string {
  if (matches.length === 0) return "";
  if (isSkillQuestion(question)) {
    return composeSkillNarrative(question, matches);
  }
  if (isNfmQuestion(question)) {
    return composeNfmNarrative(matches);
  }
  if (isArcAsraQuestion(question, matches)) {
    return composeArcNarrative(matches);
  }
  return composeGenericNarrative(matches);
}

export function retrievalLimitForQuestion(question: string, defaultLimit = 5) {
  const q = question.toLowerCase();
  if (isSkillQuestion(question) || resolveSkillFromQuery(question)) return 8;
  if (/\b(arc|asra|agi-3|arc-agi|experience)\b/.test(q)) return 12;
  if (/\b(orbit\s*wars|orbit-wars|kaggle\s*rts)\b/.test(q)) return 10;
  if (/\b(nfm|nature foundation|atlas-gs)\b/.test(q)) return 10;
  if (/\b(neurogolf|arc-genome|arc-neurogolf|onnx.*arc)\b/.test(q)) return 10;
  if (/\b(asra-security|agent security|red team|tool attack)\b/.test(q)) return 10;
  return defaultLimit;
}
