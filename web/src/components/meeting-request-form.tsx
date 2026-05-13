"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function MeetingRequestForm() {
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
      phone: String(fd.get("phone") ?? "") || null,
      company: String(fd.get("company") ?? "") || null,
      role: String(fd.get("role") ?? "") || null,
      reason: String(fd.get("reason") ?? ""),
      preferredDate: String(fd.get("preferredDate") ?? ""),
      preferredTime: String(fd.get("preferredTime") ?? ""),
      message: String(fd.get("message") ?? "") || null,
      companyWebsite: String(fd.get("companyWebsite") ?? ""),
    };
    try {
      const res = await fetch("/api/meeting-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { message?: string };
      if (!res.ok) {
        setStatus("error");
        setMsg("Could not save request.");
        return;
      }
      setStatus("done");
      setMsg(
        data.message ??
          "Thanks — your meeting request was saved. Ilak will follow up.",
      );
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
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="m-name">Name</Label>
          <Input id="m-name" name="name" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="m-email">Email</Label>
          <Input id="m-email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="m-phone">Phone</Label>
          <Input id="m-phone" name="phone" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="m-company">Company</Label>
          <Input id="m-company" name="company" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="m-role">Role</Label>
        <Input id="m-role" name="role" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="m-reason">Reason for meeting</Label>
        <Textarea id="m-reason" name="reason" required rows={3} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="m-date">Preferred date</Label>
          <Input id="m-date" name="preferredDate" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="m-time">Preferred time</Label>
          <Input id="m-time" name="preferredTime" required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="m-msg">Message</Label>
        <Textarea id="m-msg" name="message" rows={3} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-destructive">{msg}</p>
      ) : null}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : "Submit request"}
      </Button>
    </form>
  );
}
