"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Message = {
  role: "user" | "agent";
  content: string;
  sources?: string[];
  refused?: boolean;
};

type AgentChatProps = {
  inviteToken: string;
  label?: string | null;
  initialSeconds?: number;
};

const SUGGESTIONS = [
  "What roles is Ilak interested in?",
  "Tell me about ASRA Phase 4",
  "What is Orbit Wars?",
  "How do I schedule a meeting?",
];

export function AgentChat({
  inviteToken,
  label,
  initialSeconds,
}: AgentChatProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(
    initialSeconds ?? null,
  );
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content:
        "Welcome — I'm Ilak's general-Agent1. I answer from verified claims in the knowledge graph with citations. What would you like to know about Ilak's work, research, or scheduling?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const turnStarted = useRef<number | null>(null);

  const initSession = useCallback(async () => {
    const res = await fetch("/api/agent/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Agent-Invite-Token": inviteToken,
      },
      body: JSON.stringify({ token: inviteToken }),
    });
    if (!res.ok) {
      setError("This invite link is invalid or expired.");
      return;
    }
    const data = (await res.json()) as {
      sessionId: string;
      secondsRemaining: number;
    };
    setSessionId(data.sessionId);
    setSecondsRemaining(data.secondsRemaining);
  }, [inviteToken]);

  useEffect(() => {
    void initSession();
  }, [initSession]);

  async function ask(q: string) {
    if (!sessionId || !q.trim()) return;
    setLoading(true);
    setError(null);
    turnStarted.current = Date.now();
    setMessages((prev) => [...prev, { role: "user", content: q.trim() }]);
    setQuestion("");

    try {
      const elapsedSec = 30;
      const res = await fetch("/api/agent/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Agent-Invite-Token": inviteToken,
        },
        body: JSON.stringify({
          question: q.trim(),
          sessionId,
          token: inviteToken,
          elapsedSec,
        }),
      });
      const data = (await res.json()) as {
        answer?: string;
        sources?: string[];
        refused?: boolean;
        conversationSecondsRemaining?: number;
        error?: string;
      };
      if (!res.ok) {
        setError(data.error ?? "Request failed");
        return;
      }
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: data.answer ?? "No answer.",
          sources: data.sources,
          refused: data.refused,
        },
      ]);
      if (typeof data.conversationSecondsRemaining === "number") {
        setSecondsRemaining(data.conversationSecondsRemaining);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      turnStarted.current = null;
    }
  }

  const budgetExhausted =
    secondsRemaining !== null && secondsRemaining <= 0;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">
            Ilak&apos;s general-Agent1
          </h2>
          {label ? (
            <p className="text-xs text-muted-foreground">Invite: {label}</p>
          ) : null}
        </div>
        {secondsRemaining !== null ? (
          <p className="text-xs font-medium text-muted-foreground">
            Time remaining: {formatSeconds(secondsRemaining)}
          </p>
        ) : null}
      </div>

      <p className="text-sm text-muted-foreground">
        Answers come only from verified claims with citations. If something is
        not covered, the agent will refuse—no guessing about salary, visa, or
        unreleased work.
      </p>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-border bg-muted/20 p-3">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === "user"
                ? "ml-8 rounded-lg bg-primary/10 p-3 text-sm"
                : "mr-8 rounded-lg border border-border bg-background p-3 text-sm"
            }
          >
            <p className="whitespace-pre-wrap">{m.content}</p>
            {m.sources && m.sources.length > 0 ? (
              <ul className="mt-2 space-y-1 text-xs">
                {m.sources.map((s) => (
                  <li key={s}>
                    <a
                      className="text-primary hover:underline"
                      href={s}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {s}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>

      {!budgetExhausted ? (
        <>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="sm"
                disabled={loading || !sessionId}
                onClick={() => void ask(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="agent-q">Your question</Label>
            <Input
              id="agent-q"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask Ilak's grounded agent…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void ask(question);
                }
              }}
            />
          </div>
          <Button
            type="button"
            onClick={() => void ask(question)}
            disabled={loading || !sessionId || question.trim().length < 2}
          >
            {loading ? "Searching…" : "Ask"}
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Conversation time for this invite is used up. Contact Ilak via the{" "}
          <a className="text-primary hover:underline" href="/contact">
            Contact page
          </a>{" "}
          if you need more access.
        </p>
      )}
    </div>
  );
}

function formatSeconds(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
