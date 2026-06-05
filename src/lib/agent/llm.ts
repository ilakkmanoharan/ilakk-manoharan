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
              "Paraphrase the verified facts below to answer the question. Use only the provided facts. If insufficient, say you do not have verified information.",
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
