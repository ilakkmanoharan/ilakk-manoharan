-- CreateTable
CREATE TABLE "AgentKnowledgeCandidate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "citations" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "promotedClaimId" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgentKnowledgeCandidate_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "AgentSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AgentKnowledgeCandidate_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "AgentMessage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentKnowledgeCandidate_messageId_key" ON "AgentKnowledgeCandidate"("messageId");

-- CreateIndex
CREATE INDEX "AgentKnowledgeCandidate_status_idx" ON "AgentKnowledgeCandidate"("status");

-- CreateIndex
CREATE INDEX "AgentKnowledgeCandidate_sessionId_idx" ON "AgentKnowledgeCandidate"("sessionId");
