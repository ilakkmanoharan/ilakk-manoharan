"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AgentMessageContent } from "@/components/agent-message-content";
import { CURRENT_PROJECT_PROMPT, isCurrentProjectQuestion } from "@/lib/agent/current-project";
import { speakAgentText } from "@/lib/agent/speak";

type ChatMessage = {
  role: "agent" | "user";
  content: string;
  html?: string;
};

const GREETING = "Hi, how can I help you?";
const FALLBACK =
  "I can currently answer questions about Ilak's current project. Try: tell me about Ilak's current project";

export function MeetMyAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "agent", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (greeted || typeof window === "undefined" || !window.speechSynthesis) return;
    setGreeted(true);
    speakAgentText(GREETING);
  }, [greeted]);

  async function submit(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");

    const isCurrentProject = isCurrentProjectQuestion(trimmed);

    if (!isCurrentProject) {
      setMessages((prev) => [...prev, { role: "agent", content: FALLBACK }]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/agent/current-work");
      const data = (await res.json()) as {
        plain?: string;
        html?: string;
        spoken?: string;
      };
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: data.plain ?? "Unable to load current project.",
          html: data.html,
        },
      ]);
      if (data.spoken) {
        speakAgentText(data.spoken);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "agent",
          content: "Sorry — I couldn't load Ilak's current project right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-violet-50 via-fuchsia-50/80 to-pink-50 shadow-lg dark:from-violet-950/40 dark:via-fuchsia-950/30 dark:to-pink-950/20">
      <div className="flex flex-col items-center px-4 py-8 md:px-8 md:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-full bg-primary/10 blur-xl" aria-hidden />
          <Image
            src="/images/agent-avatar.png"
            alt="Ilak's agent avatar"
            width={160}
            height={160}
            className="relative rounded-full border-4 border-white/80 shadow-xl dark:border-white/20"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="relative mt-5 max-w-md"
        >
          <div
            className="absolute -top-2 left-1/2 size-3 -translate-x-1/2 rotate-45 bg-white dark:bg-card"
            aria-hidden
          />
          <div className="rounded-2xl border border-border/60 bg-white/90 px-5 py-3 text-center text-sm font-medium shadow-sm dark:bg-card/90">
            {GREETING}
          </div>
        </motion.div>
      </div>

      <div className="border-t border-border/60 bg-white/70 dark:bg-card/50">
        <div className="max-h-[min(360px,45vh)] space-y-3 overflow-y-auto px-4 py-4">
          {messages.slice(1).map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 ${
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-muted/40"
                }`}
              >
                <AgentMessageContent content={m.content} html={m.html} />
              </div>
            </div>
          ))}
          {loading ? (
            <p className="text-center text-xs text-muted-foreground">Loading…</p>
          ) : null}
          <div ref={bottomRef} />
        </div>

        <div className="border-t border-border/60 p-4">
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-auto whitespace-normal bg-white/80 py-1.5 text-left text-xs dark:bg-card/80"
              disabled={loading}
              onClick={() => void submit(CURRENT_PROJECT_PROMPT)}
            >
              {CURRENT_PROJECT_PROMPT}
            </Button>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void submit(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask my agent something…"
              disabled={loading}
              aria-label="Ask my agent"
              className="bg-white/90 dark:bg-card/90"
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? "…" : "Send"}
            </Button>
          </form>
          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            Try: {CURRENT_PROJECT_PROMPT}
          </p>
        </div>
      </div>
    </section>
  );
}
