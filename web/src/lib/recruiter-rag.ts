import fs from "node:fs";
import path from "node:path";

const FALLBACK =
  "I don’t have that information yet. Please contact Ilak directly.";

let cachedChunks: string[] | null = null;

function loadChunks(): string[] {
  if (cachedChunks) return cachedChunks;
  const file = path.join(
    process.cwd(),
    "public",
    "recruiter-data",
    "recruiter-qa.md",
  );
  const raw = fs.readFileSync(file, "utf8");
  cachedChunks = raw
    .split(/\n##\s+/)
    .map((c) => c.trim())
    .filter(Boolean);
  return cachedChunks;
}

function tokenize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

export function retrieveRecruiterAnswer(question: string): {
  answer: string;
  matched: boolean;
} {
  const words = new Set(tokenize(question));
  if (words.size === 0) {
    return { answer: FALLBACK, matched: false };
  }
  const chunks = loadChunks();
  let bestScore = 0;
  let bestChunk = "";
  for (const chunk of chunks) {
    const lc = chunk.toLowerCase();
    let score = 0;
    for (const w of words) {
      if (lc.includes(w)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestChunk = chunk;
    }
  }
  if (bestScore < 2 || !bestChunk) {
    return { answer: FALLBACK, matched: false };
  }
  return { answer: bestChunk.replace(/^#\s+/m, "").trim(), matched: true };
}
