"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function StartupInterestDialog({
  startupName,
}: {
  startupName: string;
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

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
      startupName,
      reason: String(fd.get("reason") ?? ""),
      comments: String(fd.get("comments") ?? "") || null,
      preferredContact: String(fd.get("preferredContact") ?? ""),
      companyWebsite: String(fd.get("companyWebsite") ?? ""),
    };

    try {
      const res = await fetch("/api/startup-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }
      setStatus("done");
      setMessage(
        data.message ??
          "Thank you. Your interest has been recorded. Ilak will review your message and follow up.",
      );
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        I&apos;m interested in this startup
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Interest in {startupName}</DialogTitle>
          </DialogHeader>
          {status === "done" ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : (
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
                <Label htmlFor="si-name">Name</Label>
                <Input id="si-name" name="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" name="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-phone">Phone</Label>
                <Input id="si-phone" name="phone" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-company">Company</Label>
                <Input id="si-company" name="company" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-role">Role</Label>
                <Input id="si-role" name="role" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-reason">Reason for interest</Label>
                <Textarea id="si-reason" name="reason" required rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-comments">Comments</Label>
                <Textarea id="si-comments" name="comments" rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-contact">Preferred contact method</Label>
                <select
                  id="si-contact"
                  name="preferredContact"
                  required
                  className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              {status === "error" ? (
                <p className="text-sm text-destructive">{message}</p>
              ) : null}
              <DialogFooter>
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting…" : "Submit"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
