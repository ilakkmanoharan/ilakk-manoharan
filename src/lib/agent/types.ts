export type AgentClaim = {
  id: string;
  text: string;
  topics: string[];
  sources: string[];
  lastVerified?: string;
  lastSynced?: string;
  /** manual = hand-authored; auto = synced from site content; conversation = promoted from verified chat */
  origin?: "manual" | "recruiter" | "project" | "hackathon" | "startup" | "skill" | "exceptional-ability" | "page" | "scilayer" | "conversation";
  verified?: boolean;
};

export type ClaimsGraph = {
  version: number;
  lastSynced?: string;
  claims: AgentClaim[];
};

export type RetrievedClaim = AgentClaim & {
  score: number;
};

export type AgentCitation = {
  id: string;
  text: string;
  sources: string[];
};

export type AgentQueryResult = {
  answer: string;
  confidence: "high" | "low";
  claims: AgentCitation[];
  sources: string[];
  refused: boolean;
  conversationSecondsRemaining: number | null;
};

export type AgentAccessContext = {
  sessionId: string;
  inviteId: string | null;
  accessType: "invite" | "public_denied";
  secondsRemaining: number | null;
};
