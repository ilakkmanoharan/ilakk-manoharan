"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RecruiterMessageForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? "") || null,
      message: String(fd.get("message") ?? ""),
      companyWebsite: String(fd.get("companyWebsite") ?? ""),
    };
    try {
      const res = await fetch("/api/recruiter-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        setMsg("Could not send message.");
        return;
      }
      setStatus("done");
      setMsg("Message received. Ilak will follow up.");
      form.reset();
    } catch {
      setStatus("error");
      setMsg("Network error.");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-muted-foreground">{msg}</p>;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <input
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
      />
      <div className="grid gap-2">
        <Label htmlFor="rm-name">Name</Label>
        <Input id="rm-name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rm-email">Email</Label>
        <Input id="rm-email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rm-company">Company</Label>
        <Input id="rm-company" name="company" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="rm-message">Message</Label>
        <Textarea id="rm-message" name="message" required rows={4} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-destructive">{msg}</p>
      ) : null}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
