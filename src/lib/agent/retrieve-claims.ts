import { composeAnswer, retrievalLimitForQuestion } from "@/lib/agent/compose-answer";
import { AGENT_MIN_MATCH_SCORE, AGENT_REFUSAL } from "@/lib/agent/config";
import {
  invalidateClaimsCache,
  loadClaimsGraph,
  loadRecruiterChunks,
} from "@/lib/agent/knowledge";
import { isProgramDefinitionQuestion } from "@/lib/agent/query-intent";
import {
  claimIsEligibleForRetrieval,
  filterPublicSources,
} from "@/lib/agent/source-policy";
import type { AgentClaim, AgentQueryResult, RetrievedClaim } from "@/lib/agent/types";
import {
  invalidateTfidfCache,
  tfidfScoreClaim,
  tokenizeForVectors,
} from "@/lib/agent/tfidf-retrieval";
import { resolveSkillFromQuery } from "@/lib/project-skills-index";
import { prisma } from "@/lib/prisma";

const STOPWORDS = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "its",
  "may",
  "new",
  "now",
  "old",
  "see",
  "two",
  "who",
  "boy",
  "did",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "tell",
  "about",
  "what",
  "when",
  "where",
  "which",
  "with",
  "have",
  "from",
  "this",
  "that",
  "your",
  "will",
  "would",
  "could",
  "should",
  "been",
  "being",
  "does",
  "into",
  "more",
  "some",
  "them",
  "than",
  "then",
  "there",
  "these",
  "they",
  "also",
  "just",
  "like",
  "make",
  "know",
  "want",
  "give",
  "work",
  "ilak",
  "me",
]);

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function scoreText(text: string, words: string[]) {
  const lc = text.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (lc.includes(w)) score += 1;
  }
  const q = words.join(" ");
  if (q.length > 8 && lc.includes(q)) score += 4;
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (lc.includes(bigram)) score += 2;
  }
  return score;
}

function scoreClaim(
  claim: AgentClaim,
  words: string[],
  allClaims: AgentClaim[],
): number {
  let score = scoreText(claim.text, words);
  for (const topic of claim.topics) {
    score += scoreText(topic, words) * 1.5;
  }
  const vectorScore = tfidfScoreClaim(claim, words, allClaims) * 8;
  return score + vectorScore;
}

async function loadApprovedConversationClaims(): Promise<AgentClaim[]> {
  try {
    const rows = await prisma.agentKnowledgeCandidate.findMany({
      where: { status: "approved" },
      orderBy: { reviewedAt: "desc" },
      take: 100,
    });
    return rows.map((r) => {
      const citations = r.citations as { sources?: string[] } | null;
      return {
        id: r.promotedClaimId ?? `claim-promoted-${r.id}`,
        text: r.answer,
        topics: tokenize(r.question),
        sources:
          citations?.sources?.length
            ? citations.sources
            : ["https://ilakk-manoharan.vercel.app/agent"],
        origin: "conversation" as const,
        verified: true,
      };
    });
  } catch {
    return [];
  }
}

export async function retrieveClaims(
  question: string,
  limit = 5,
): Promise<{ matches: RetrievedClaim[]; refused: boolean }> {
  invalidateClaimsCache();
  invalidateTfidfCache();
  const words = tokenizeForVectors(question);
  const lexicalWords = tokenize(question);
  if (words.length === 0) {
    return { matches: [], refused: true };
  }

  const graph = loadClaimsGraph();
  const approved = await loadApprovedConversationClaims();
  const allClaims = [...graph.claims, ...approved].filter(claimIsEligibleForRetrieval);
  const skill = resolveSkillFromQuery(question);
  const skillBoost =
    skill?.id && !isProgramDefinitionQuestion(question) ? skill.id : null;

  const scored: RetrievedClaim[] = allClaims
    .map((claim) => {
      let score = scoreClaim(
        claim,
        lexicalWords.length ? lexicalWords : words,
        allClaims,
      );
      if (
        skillBoost &&
        (claim.id.includes(`skill-has-${skillBoost}`) ||
          claim.id.includes(`skill-projects-${skillBoost}`) ||
          claim.id.includes(`skill-edge-${skillBoost}`) ||
          claim.topics.some((t) => t.includes(skillBoost.replace(/-/g, " "))))
      ) {
        score += 12;
      }
      return { ...claim, score };
    })
    .filter((c) => c.score >= AGENT_MIN_MATCH_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  if (scored.length > 0) {
    return { matches: scored, refused: false };
  }

  const chunks = loadRecruiterChunks();
  let bestScore = 0;
  let bestChunk = "";
  for (const chunk of chunks) {
    const score = scoreText(chunk, lexicalWords.length ? lexicalWords : words);
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  }

  if (bestScore >= AGENT_MIN_MATCH_SCORE && bestChunk) {
    const text = bestChunk.replace(/^#\s+/m, "").trim();
    return {
      matches: [
        {
          id: "recruiter-qa-fallback",
          text,
          topics: ["recruiter"],
          sources: ["https://ilakk-manoharan.vercel.app/recruiter"],
          score: bestScore,
        },
      ],
      refused: false,
    };
  }

  return { matches: [], refused: true };
}

export async function buildQueryResultFromClaims(
  question: string,
  secondsRemaining: number | null,
): Promise<AgentQueryResult> {
  const limit = retrievalLimitForQuestion(question);
  const { matches, refused } = await retrieveClaims(question, limit);
  if (refused || matches.length === 0) {
    return {
      answer: AGENT_REFUSAL,
      confidence: "low",
      claims: [],
      sources: [
        "https://ilakk-manoharan.vercel.app/contact",
        "https://ilakk-manoharan.vercel.app/schedule",
      ],
      refused: true,
      conversationSecondsRemaining: secondsRemaining,
    };
  }

  const sources = filterPublicSources(matches.flatMap((m) => m.sources));
  const answer = composeAnswer(question, matches);
  const citedMatches = matches.slice(0, 6);

  return {
    answer,
    confidence: matches[0].score >= AGENT_MIN_MATCH_SCORE + 2 ? "high" : "high",
    claims: citedMatches.map((m) => ({
      id: m.id,
      text: m.text,
      sources: filterPublicSources(m.sources),
    })),
    sources,
    refused: false,
    conversationSecondsRemaining: secondsRemaining,
  };
}
