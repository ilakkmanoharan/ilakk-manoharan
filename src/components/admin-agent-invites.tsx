"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  createAgentInvite,
  revokeAgentInvite,
  type AdminInviteRow,
} from "@/lib/agent/admin-invites-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  initialInvites: AdminInviteRow[];
  loadError?: string | null;
};

export function AdminAgentInvites({ initialInvites, loadError }: Props) {
  const router = useRouter();
  const invites = initialInvites;
  const [label, setLabel] = useState("");
  const [minutes, setMinutes] = useState("10");
  const [days, setDays] = useState("7");
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(loadError ?? null);
  const [pending, startTransition] = useTransition();

  function refresh() {
    router.refresh();
  }

  function createInvite() {
    setError(null);
    setLastUrl(null);
    startTransition(async () => {
      const result = await createAgentInvite({
        label: label.trim() || undefined,
        conversationMinutes: Number(minutes),
        expiryDays: Number(days),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLastUrl(result.url);
      setLabel("");
      refresh();
    });
  }

  function revoke(id: string) {
    setError(null);
    startTransition(async () => {
      const result = await revokeAgentInvite(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create invite</CardTitle>
          <CardDescription>
            Private link: /agent/g/&#123;token&#125;. Same auth for HTTP API and
            MCP.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="invite-label">Label</Label>
            <Input
              id="invite-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. k_dense_ai screen"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invite-minutes">Conversation minutes</Label>
            <Input
              id="invite-minutes"
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="invite-days">Link expiry (days)</Label>
            <Input
              id="invite-days"
              type="number"
              min={1}
              max={90}
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Button
              type="button"
              disabled={pending}
              onClick={() => createInvite()}
            >
              {pending ? "Creating…" : "Create invite"}
            </Button>
          </div>
          {lastUrl ? (
            <p className="text-sm sm:col-span-2">
              New link:{" "}
              <a className="text-primary hover:underline" href={lastUrl}>
                {lastUrl}
              </a>
            </p>
          ) : null}
          {error ? (
            <p className="text-sm text-destructive sm:col-span-2">{error}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {invites.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-wrap items-start justify-between gap-2 border-b border-border pb-3 last:border-0"
            >
              <div>
                <p className="font-medium">{inv.label ?? "Untitled"}</p>
                <p className="text-xs text-muted-foreground">
                  {inv.status} · {inv.sessionCount} sessions · expires{" "}
                  {new Date(inv.expiresAt).toLocaleDateString()}
                </p>
                <p className="text-xs text-muted-foreground">
                  Budget: {Math.floor(inv.usedConversationSec / 60)}/
                  {Math.floor(inv.conversationBudgetSec / 60)} min
                </p>
                <a
                  className="text-xs text-primary hover:underline"
                  href={`/agent/g/${inv.token}`}
                >
                  /agent/g/{inv.token.slice(0, 8)}…
                </a>
              </div>
              {inv.status === "active" ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={pending}
                  onClick={() => revoke(inv.id)}
                >
                  Revoke
                </Button>
              ) : null}
            </div>
          ))}
          {invites.length === 0 ? (
            <p className="text-muted-foreground">No invites yet.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
