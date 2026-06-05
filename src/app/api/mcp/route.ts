import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createPortfolioMcpServer } from "@/lib/agent/mcp-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleMcp(request: Request) {
  const inviteToken = request.headers.get("X-Agent-Invite-Token") ?? undefined;

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  const server = createPortfolioMcpServer(() => inviteToken);
  await server.connect(transport);

  return transport.handleRequest(request);
}

export async function GET(request: Request) {
  return handleMcp(request);
}

export async function POST(request: Request) {
  return handleMcp(request);
}

export async function DELETE(request: Request) {
  return handleMcp(request);
}
