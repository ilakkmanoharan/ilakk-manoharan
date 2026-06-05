import { siteConfig } from "@/lib/site";
import { AGENT_NAME } from "@/lib/agent/config";

export function buildAgentManifest() {
  const base = siteConfig.url.replace(/\/$/, "");
  return {
    name: AGENT_NAME,
    description: "Grounded portfolio representative for Ilakkuvaselvi (Ilak) Manoharan",
    version: "1.0.0",
    endpoints: {
      query: `${base}/api/agent/query`,
      session: `${base}/api/agent/session`,
      mcp: `${base}/api/mcp`,
      human: `${base}/agent`,
    },
    mcp: {
      transport: "streamable-http",
      url: `${base}/api/mcp`,
      tools: [
        "search_facts",
        "get_project",
        "get_evidence",
        "get_skills",
        "get_availability",
      ],
      resources: ["portfolio://manifest", "portfolio://knowledge-graph"],
    },
    policy:
      "Answers only from verified claims with citations; refuses when uncertain. Does not infer salary, visa, or unreleased work.",
    auth: {
      type: "invite_token",
      header: "X-Agent-Invite-Token",
      bodyField: "token",
    },
  };
}
