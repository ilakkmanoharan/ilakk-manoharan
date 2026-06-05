"use client";

import { useState } from "react";
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

type InviteRow = {
  id: string;
  token: string;
  label: string | null;
  expiresAt: string;
  conversationBudgetSec: number;
  usedConversationSec: number;
  status: string;
  createdAt: string;
  _count: { sessions: number };
};

export function AdminAgentInvites() {
  const [invites, setInvites] = useState<InviteRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [label, setLabel] = useState("");
  const [minutes, setMinutes] = useState("10");
  const [days, setDays] = useState("7");
  const [creating, setCreating] = useState(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadInvites() {
    const res = await fetch("/api/admin/agent/invites");
    if (!res.ok) {
      setError("Failed to load invites");
      return;
    }
    const data = (await res.json()) as { invites: InviteRow[] };
    setInvites(data.invites);
    setLoaded(true);
  }

  async function createInvite() {
    setCreating(true);
    setError(null);
    setLastUrl(null);
    try {
      const res = await fetch("/api/admin/agent/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: label.trim() || undefined,
          conversationMinutes: Number(minutes),
          expiryDays: Number(days),
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Create failed");
        return;
      }
      setLastUrl(data.url ?? null);
      setLabel("");
      await loadInvites();
    } finally {
      setCreating(false);
    }
  }

  async function revoke(id: string) {
    await fetch(`/api/admin/agent/invites/${id}`, { method: "DELETE" });
    await loadInvites();
  }

  return (
    <div className="space-y-6">
      {!loaded ? (
        <Button type="button" onClick={() => void loadInvites()}>
          Load invites
        </Button>
      ) : null}

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
              disabled={creating}
              onClick={() => void createInvite()}
            >
              {creating ? "Creating…" : "Create invite"}
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

      {loaded ? (
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
                    {inv.status} · {inv._count.sessions} sessions · expires{" "}
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
                    /agent/g/…
                  </a>
                </div>
                {inv.status === "active" ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void revoke(inv.id)}
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
      ) : null}
    </div>
  );
}
