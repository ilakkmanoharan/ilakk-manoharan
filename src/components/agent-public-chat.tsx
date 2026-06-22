"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgentMessageContent } from "@/components/agent-message-content";
import { CURRENT_PROJECT_PROMPT } from "@/lib/agent/current-project";

type Message = {
  role: "user" | "agent";
  content: string;
  html?: string;
  sources?: string[];
  refused?: boolean;
};

const WELCOME =
  "Hi — I'm Ilak's general-Agent1. What would you like to know about Ilak's work, research, or how to get in touch?";

const SUGGESTIONS = [
  CURRENT_PROJECT_PROMPT,
  "Does Ilak have Python experience?",
  "Projects involving machine learning",
  "What is Orbit Wars Phase 4?",
  "Does Ilak know backend engineering?",
  "How do I schedule a meeting?",
];

export function AgentPublicChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", content: WELCOME },
  ]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, scanning]);

  async function ask(q: string) {
    const trimmed = q.trim();
    if (trimmed.length < 2 || loading) return;

    setLoading(true);
    setScanning(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setQuestion("");

    try {
      const res = await fetch("/api/agent/demo-query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = (await res.json()) as {
        answer?: string;
        html?: string;
        sources?: string[];
        refused?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "agent",
            content: data.error ?? "Something went wrong. Try again or use Contact.",
            refused: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: data.answer ?? "No answer.",
          html: data.html,
          sources: data.sources,
          refused: data.refused,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Network error. Please try again.",
          refused: true,
        },
      ]);
    } finally {
      setLoading(false);
      setScanning(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
      <div className="border-b border-border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Bot className="size-5" aria-hidden />
          </div>
          <div>
            <p className="font-heading font-semibold">Try the agent</p>
          </div>
        </div>
      </div>

      <div className="flex h-[min(420px,55vh)] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {m.role === "user" ? (
                  <User className="size-4" aria-hidden />
                ) : (
                  <Bot className="size-4" aria-hidden />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/30"
                }`}
              >
                <AgentMessageContent content={m.content} html={m.html} />
                {m.sources && m.sources.length > 0 ? (
                  <ul className="mt-3 space-y-1 border-t border-border/60 pt-2 text-xs">
                    <li className="font-medium opacity-80">Sources</li>
                    {m.sources.slice(0, 4).map((s) => (
                      <li key={s}>
                        <a
                          className="text-primary hover:underline"
                          href={s}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {formatSourceLabel(s)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ))}

          {scanning ? (
            <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
              <Sparkles className="size-3.5 animate-pulse text-primary" aria-hidden />
              <span>Scanning knowledge graph (TF-IDF vectors)…</span>
              <span className="inline-flex gap-1">
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </span>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border bg-muted/20 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Button
                key={s}
                type="button"
                variant="outline"
                size="sm"
                className="h-auto whitespace-normal py-1.5 text-left text-xs"
                disabled={loading}
                onClick={() => void ask(s)}
              >
                {s}
              </Button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void ask(question);
            }}
          >
            <Input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask about projects, ASRA, NFM, Orbit Wars, papers…"
              disabled={loading}
              aria-label="Your question"
            />
            <Button type="submit" disabled={loading || question.trim().length < 2}>
              {loading ? "…" : "Send"}
            </Button>
          </form>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Demo mode: answers only from verified claims. Full timed sessions require an
            invite link below.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatSourceLabel(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("sci-layer")) return `SciLayer · ${u.pathname.split("/").pop()}`;
    if (u.hostname.includes("github")) return `GitHub · ${u.pathname.slice(1)}`;
    return u.hostname + u.pathname.slice(0, 40);
  } catch {
    return url;
  }
}
