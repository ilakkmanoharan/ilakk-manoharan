import { AGENT_MIN_MATCH_SCORE, AGENT_REFUSAL } from "@/lib/agent/config";
import {
  loadClaimsGraph,
  loadRecruiterChunks,
} from "@/lib/agent/knowledge";
import type { AgentQueryResult, RetrievedClaim } from "@/lib/agent/types";

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function scoreText(text: string, words: Set<string>) {
  const lc = text.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (lc.includes(w)) score += 1;
  }
  return score;
}

export function retrieveClaims(
  question: string,
  limit = 5,
): { matches: RetrievedClaim[]; refused: boolean } {
  const words = new Set(tokenize(question));
  if (words.size === 0) {
    return { matches: [], refused: true };
  }

  const graph = loadClaimsGraph();
  const scored: RetrievedClaim[] = graph.claims
    .map((claim) => ({
      ...claim,
      score:
        scoreText(claim.text, words) +
        claim.topics.reduce((acc, t) => acc + scoreText(t, words), 0),
    }))
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
    const score = scoreText(chunk, words);
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

export function buildQueryResultFromClaims(
  question: string,
  secondsRemaining: number | null,
): AgentQueryResult {
  const { matches, refused } = retrieveClaims(question);
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

  const sources = [...new Set(matches.flatMap((m) => m.sources))];
  const answer = matches.map((m) => m.text).join("\n\n");

  return {
    answer,
    confidence: matches[0].score >= AGENT_MIN_MATCH_SCORE + 2 ? "high" : "high",
    claims: matches.map((m) => ({
      id: m.id,
      text: m.text,
      sources: m.sources,
    })),
    sources,
    refused: false,
    conversationSecondsRemaining: secondsRemaining,
  };
}
