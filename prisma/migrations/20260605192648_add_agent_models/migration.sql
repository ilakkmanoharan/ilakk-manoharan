-- CreateTable
CREATE TABLE "AgentInvite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "label" TEXT,
    "expiresAt" DATETIME NOT NULL,
    "conversationBudgetSec" INTEGER NOT NULL,
    "usedConversationSec" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "AgentSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inviteId" TEXT,
    "accessType" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" DATETIME,
    "usedSeconds" INTEGER NOT NULL DEFAULT 0,
    "exportedAt" DATETIME,
    CONSTRAINT "AgentSession_inviteId_fkey" FOREIGN KEY ("inviteId") REFERENCES "AgentInvite" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AgentMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "citations" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AgentSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentInvite_token_key" ON "AgentInvite"("token");

-- CreateIndex
CREATE INDEX "AgentSession_inviteId_idx" ON "AgentSession"("inviteId");

-- CreateIndex
CREATE INDEX "AgentSession_startedAt_idx" ON "AgentSession"("startedAt");

-- CreateIndex
CREATE INDEX "AgentMessage_sessionId_idx" ON "AgentMessage"("sessionId");
