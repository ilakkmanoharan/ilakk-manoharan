import { agentConfig } from "@/lib/agent/config";
import type { AgentQueryResult } from "@/lib/agent/types";

export async function maybeParaphraseAnswer(
  question: string,
  result: AgentQueryResult,
): Promise<AgentQueryResult> {
  const cfg = agentConfig();
  if (!cfg.llmEnabled || result.refused) return result;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || cfg.llmProvider !== "openai") return result;

  const context = result.claims.map((c) => c.text).join("\n");
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: cfg.llmModel,
        temperature: cfg.llmTemperature,
        max_tokens: cfg.llmMaxTokens,
        messages: [
          {
            role: "system",
            content:
              "You are Ilak's portfolio agent. Rewrite the verified facts into a clear, story-like answer in chronological or logical order. Use only the provided facts—do not invent details. Prefer short paragraphs over bullet dumps. For ASRA/ARC topics, walk Phase 1 → Phase 2 → Phase 3 → Phase 4 when those facts are present. If insufficient facts, say you do not have verified information.",
          },
          {
            role: "user",
            content: `Question: ${question}\n\nVerified facts:\n${context}`,
          },
        ],
      }),
    });
    if (!res.ok) return result;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return result;
    return { ...result, answer: text };
  } catch {
    return result;
  }
}
