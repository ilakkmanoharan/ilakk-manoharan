import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { buildAgentManifest } from "@/lib/agent/manifest";
import {
  getEvidenceSection,
  getProjectMarkdown,
  listProjectSlugs,
  loadClaimsGraph,
} from "@/lib/agent/knowledge";
import { retrieveClaims } from "@/lib/agent/retrieve-claims";
import { validateInviteToken } from "@/lib/agent/session";
import { prisma } from "@/lib/prisma";

async function requireInviteToken(token: string | undefined) {
  if (!token?.trim()) {
    throw new Error("Missing invite token. Pass token in tool args or X-Agent-Invite-Token header.");
  }
  const validation = await validateInviteToken(token.trim());
  if (!validation.ok) {
    throw new Error(`Invite invalid: ${validation.reason}`);
  }
  return validation;
}

export function createPortfolioMcpServer(getToken: () => string | undefined) {
  const server = new McpServer(
    { name: "general-agent-1", version: "1.0.0" },
    {
      instructions:
        "Grounded portfolio agent for Ilak Manoharan. All tools require a valid invite token.",
    },
  );

  server.registerTool(
    "search_facts",
    {
      description: "Search verified claims about Ilak with source URLs",
      inputSchema: {
        query: z.string().describe("Natural language question"),
        token: z.string().optional().describe("Invite token if not in header"),
        limit: z.number().optional(),
      },
    },
    async ({ query, token, limit }) => {
      await requireInviteToken(token ?? getToken());
      const { matches, refused } = await retrieveClaims(query, limit ?? 5);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ refused, matches }, null, 2),
          },
        ],
      };
    },
  );

  server.registerTool(
    "get_project",
    {
      description: "Read a portfolio project markdown card by slug",
      inputSchema: {
        slug: z.string(),
        token: z.string().optional(),
      },
    },
    async ({ slug, token }) => {
      await requireInviteToken(token ?? getToken());
      const md = getProjectMarkdown(slug);
      if (!md) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({
                error: "not_found",
                available: listProjectSlugs(),
              }),
            },
          ],
        };
      }
      return {
        content: [{ type: "text" as const, text: md }],
      };
    },
  );

  server.registerTool(
    "get_evidence",
    {
      description: "Exceptional ability evidence card (1-10)",
      inputSchema: {
        number: z.number().int().min(1).max(10),
        token: z.string().optional(),
      },
    },
    async ({ number, token }) => {
      await requireInviteToken(token ?? getToken());
      const section = getEvidenceSection(number);
      if (!section) {
        return {
          content: [
            { type: "text" as const, text: JSON.stringify({ error: "not_found" }) },
          ],
        };
      }
      return {
        content: [{ type: "text" as const, text: JSON.stringify(section, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_skills",
    {
      description: "Skills catalog from portfolio database",
      inputSchema: { token: z.string().optional() },
    },
    async ({ token }) => {
      await requireInviteToken(token ?? getToken());
      const skills = await prisma.skill.findMany({
        orderBy: { name: "asc" },
        select: {
          name: true,
          category: true,
          overview: true,
          yearsExperience: true,
          slug: true,
        },
      });
      return {
        content: [{ type: "text" as const, text: JSON.stringify(skills, null, 2) }],
      };
    },
  );

  server.registerTool(
    "get_availability",
    {
      description: "Role preferences and scheduling pointers",
      inputSchema: { token: z.string().optional() },
    },
    async ({ token }) => {
      await requireInviteToken(token ?? getToken());
      const { matches } = await retrieveClaims(
        "roles full-time startup schedule meeting contact availability remote",
        4,
      );
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                claims: matches,
                schedule: "https://ilakk-manoharan.vercel.app/schedule",
                contact: "https://ilakk-manoharan.vercel.app/contact",
              },
              null,
              2,
            ),
          },
        ],
      };
    },
  );

  server.registerResource(
    "manifest",
    "portfolio://manifest",
    {
      description: "Agent identity, policy, and endpoints",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "portfolio://manifest",
          mimeType: "application/json",
          text: JSON.stringify(buildAgentManifest(), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "knowledge-graph",
    "portfolio://knowledge-graph",
    {
      description: "Full claims export",
      mimeType: "application/json",
    },
    async () => ({
      contents: [
        {
          uri: "portfolio://knowledge-graph",
          mimeType: "application/json",
          text: JSON.stringify(loadClaimsGraph(), null, 2),
        },
      ],
    }),
  );

  return server;
}
