"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  approveKnowledgeCandidate,
  rejectKnowledgeCandidate,
  type KnowledgeCandidateRow,
} from "@/lib/agent/knowledge-candidates-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  initialCandidates: KnowledgeCandidateRow[];
  loadError?: string | null;
};

export function AdminAgentKnowledgeCandidates({
  initialCandidates,
  loadError,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(loadError ?? null);
  const [pending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function approve(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await approveKnowledgeCandidate(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  function reject(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await rejectKnowledgeCandidate(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  const pendingRows = initialCandidates.filter((c) => c.status === "pending");
  const reviewedRows = initialCandidates.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge candidates</CardTitle>
          <CardDescription>
            Successful agent answers are saved here. Approve to promote into the
            live knowledge graph (runtime merge from DB; git sync on next deploy).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          {pendingRows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending candidates. Ask the agent a grounded question via an
              invite link to queue one.
            </p>
          ) : (
            <ul className="space-y-4">
              {pendingRows.map((row) => (
                <li
                  key={row.id}
                  className="rounded-lg border border-border p-4 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-muted-foreground">
                      {row.inviteLabel ?? "invite"} ·{" "}
                      {new Date(row.createdAt).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={pending}
                        onClick={() => approve(row.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={pending}
                        onClick={() => reject(row.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 font-medium">Q: {row.question}</p>
                  <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                    {row.answer}
                  </p>
                  {row.sources.length > 0 ? (
                    <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                      {row.sources.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {reviewedRows.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recently reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {reviewedRows.slice(0, 10).map((row) => (
                <li key={row.id} className="border-b border-border pb-3 last:border-0">
                  <span
                    className={
                      row.status === "approved"
                        ? "text-green-600 dark:text-green-400"
                        : "text-muted-foreground"
                    }
                  >
                    {row.status}
                  </span>
                  {" · "}
                  {row.question.slice(0, 80)}
                  {row.question.length > 80 ? "…" : ""}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
