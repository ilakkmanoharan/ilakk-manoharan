export const AGENT_NAME = "Ilak's general-Agent1";
export const AGENT_CODENAME = "general-agent-1";

export const AGENT_REFUSAL =
  "I don't have verified information on that yet. Please use the Contact or Schedule pages on ilakk-manoharan.vercel.app, or ask about roles, projects, ASRA, SciLayer, or skills.";

export const AGENT_MIN_MATCH_SCORE = 2;

export function agentConfig() {
  return {
    llmEnabled: process.env.AGENT_LLM_ENABLED === "true",
    llmProvider: process.env.AGENT_LLM_PROVIDER ?? "openai",
    llmModel: process.env.AGENT_LLM_MODEL ?? "gpt-4o-mini",
    llmTemperature: Number(process.env.AGENT_LLM_TEMPERATURE ?? "0.2"),
    llmMaxTokens: Number(process.env.AGENT_LLM_MAX_TOKENS ?? "400"),
    defaultInviteBudgetSec: Number(
      process.env.AGENT_DEFAULT_BUDGET_SEC ?? "600",
    ),
    defaultInviteExpiryDays: Number(
      process.env.AGENT_DEFAULT_EXPIRY_DAYS ?? "7",
    ),
    zellePhone: process.env.AGENT_ZELLE_PHONE ?? "309-363-7732",
    zelleMemo: process.env.AGENT_ZELLE_MEMO ?? "AGENT1",
    publicPriceUsd: Number(process.env.AGENT_PUBLIC_PRICE_USD ?? "5"),
  };
}
