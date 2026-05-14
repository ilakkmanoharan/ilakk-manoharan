"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
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
      subject: String(fd.get("subject") ?? ""),
      reason: String(fd.get("reason") ?? "") || null,
      body: String(fd.get("body") ?? ""),
      companyWebsite: String(fd.get("companyWebsite") ?? ""),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setStatus("error");
        setMsg("Could not send.");
        return;
      }
      setStatus("done");
      setMsg("Thanks — your note was delivered.");
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
        <Label htmlFor="c-name">Name</Label>
        <Input id="c-name" name="name" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-email">Email</Label>
        <Input id="c-email" name="email" type="email" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-company">Company</Label>
        <Input id="c-company" name="company" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-subject">Subject</Label>
        <Input id="c-subject" name="subject" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-reason">Reason for contact</Label>
        <Input id="c-reason" name="reason" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="c-body">Message</Label>
        <Textarea id="c-body" name="body" required rows={5} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-destructive">{msg}</p>
      ) : null}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Submit"}
      </Button>
    </form>
  );
}
