"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginClient() {
  const searchParams = useSearchParams();
  const err = searchParams.get("error");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setStatus("error");
        const data = (await res.json()) as { error?: string };
        setMsg(data.error ?? "Login failed");
        return;
      }
      window.location.href = "/admin";
    } catch {
      setStatus("error");
      setMsg("Network error");
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-20">
      <h1 className="font-heading text-2xl font-semibold">Admin login</h1>
      {err === "config" ? (
        <p className="text-sm text-destructive">
          Server missing admin session configuration.
        </p>
      ) : null}
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="admin-pass">Password</Label>
          <Input
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {status === "error" ? (
          <p className="text-sm text-destructive">{msg}</p>
        ) : null}
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </div>
  );
}
