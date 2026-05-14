"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { suggestedRecruiterQuestions } from "@/lib/recruiter-questions";

export function RecruiterChat() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask(question: string) {
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/recruiter-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, companyWebsite: "" }),
      });
      const data = (await res.json()) as { answer?: string };
      setAnswer(data.answer ?? "Unable to load an answer.");
    } catch {
      setAnswer("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="font-heading text-lg font-semibold">Recruiter assistant</h2>
      <p className="text-sm text-muted-foreground">
        Answers are retrieved from{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          /recruiter-data/recruiter-qa.md
        </code>
        . If something is not covered, the assistant will say so—no guessing.
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestedRecruiterQuestions.map((s) => (
          <Button
            key={s}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setQ(s);
              void ask(s);
            }}
          >
            {s}
          </Button>
        ))}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="recruiter-q">Your question</Label>
        <Input
          id="recruiter-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Ask about roles, experience, or scheduling…"
        />
      </div>
      <Button
        type="button"
        onClick={() => void ask(q)}
        disabled={loading || q.trim().length < 2}
      >
        {loading ? "Searching…" : "Ask"}
      </Button>
      {answer ? (
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm whitespace-pre-wrap text-muted-foreground">
          {answer}
        </div>
      ) : null}
    </div>
  );
}
