import type { AgentClaim } from "@/lib/agent/types";

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
  "has",
  "was",
  "one",
  "our",
  "with",
  "this",
  "that",
  "from",
  "have",
  "what",
  "when",
  "where",
  "which",
  "about",
  "tell",
  "ilak",
]);

export function tokenizeForVectors(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

type VectorIndex = {
  idf: Map<string, number>;
  claimVectors: Map<string, Map<string, number>>;
  claimNorms: Map<string, number>;
};

let cachedIndex: { key: string; index: VectorIndex } | null = null;

function termFrequency(tokens: string[]) {
  const tf = new Map<string, number>();
  for (const t of tokens) {
    tf.set(t, (tf.get(t) ?? 0) + 1);
  }
  const max = Math.max(...tf.values(), 1);
  for (const [k, v] of tf) {
    tf.set(k, 0.5 + 0.5 * (v / max));
  }
  return tf;
}

function vectorNorm(vec: Map<string, number>) {
  let sum = 0;
  for (const v of vec.values()) sum += v * v;
  return Math.sqrt(sum) || 1;
}

function toTfidfVector(
  tf: Map<string, number>,
  idf: Map<string, number>,
): Map<string, number> {
  const out = new Map<string, number>();
  for (const [term, freq] of tf) {
    const weight = freq * (idf.get(term) ?? 0);
    if (weight > 0) out.set(term, weight);
  }
  return out;
}

function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>,
  normA: number,
  normB: number,
) {
  let dot = 0;
  const smaller = a.size <= b.size ? a : b;
  const larger = a.size <= b.size ? b : a;
  for (const [term, weight] of smaller) {
    const other = larger.get(term);
    if (other) dot += weight * other;
  }
  return dot / (normA * normB);
}

function buildVectorIndex(claims: AgentClaim[]): VectorIndex {
  const docFreq = new Map<string, number>();
  const docTokens: { id: string; tokens: string[] }[] = [];

  for (const claim of claims) {
    const tokens = tokenizeForVectors(
      `${claim.text} ${claim.topics.join(" ")}`,
    );
    docTokens.push({ id: claim.id, tokens });
    const seen = new Set(tokens);
    for (const t of seen) {
      docFreq.set(t, (docFreq.get(t) ?? 0) + 1);
    }
  }

  const n = Math.max(docTokens.length, 1);
  const idf = new Map<string, number>();
  for (const [term, df] of docFreq) {
    idf.set(term, Math.log((n + 1) / (df + 1)) + 1);
  }

  const claimVectors = new Map<string, Map<string, number>>();
  const claimNorms = new Map<string, number>();

  for (const { id, tokens } of docTokens) {
    const vec = toTfidfVector(termFrequency(tokens), idf);
    claimVectors.set(id, vec);
    claimNorms.set(id, vectorNorm(vec));
  }

  return { idf, claimVectors, claimNorms };
}

function getVectorIndex(claims: AgentClaim[]): VectorIndex {
  const key = `${claims.length}:${claims[0]?.id ?? ""}:${claims.at(-1)?.id ?? ""}`;
  if (cachedIndex?.key === key) return cachedIndex.index;
  const index = buildVectorIndex(claims);
  cachedIndex = { key, index };
  return index;
}

/** TF-IDF cosine similarity — vector retrieval over the knowledge graph. */
export function tfidfScoreClaim(
  claim: AgentClaim,
  questionTokens: string[],
  allClaims: AgentClaim[],
): number {
  if (questionTokens.length === 0) return 0;
  const index = getVectorIndex(allClaims);
  const queryTf = termFrequency(questionTokens);
  const queryVec = toTfidfVector(queryTf, index.idf);
  const queryNorm = vectorNorm(queryVec);
  const claimVec = index.claimVectors.get(claim.id);
  const claimNorm = index.claimNorms.get(claim.id);
  if (!claimVec || !claimNorm) return 0;
  return cosineSimilarity(queryVec, claimVec, queryNorm, claimNorm);
}

export function invalidateTfidfCache() {
  cachedIndex = null;
}
