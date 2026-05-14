import type { Metadata } from "next";
import { MeetingRequestForm } from "@/components/meeting-request-form";
import { ViewTracker } from "@/components/view-tracker";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schedule a Meeting",
  description:
    "Book time with Ilak via Cal.com or Calendly embed, or submit a structured meeting request.",
};

export default function SchedulePage() {
  const embed = siteConfig.calEmbedUrl?.trim();

  return (
    <>
      <ViewTracker path="/schedule" resourceType="page" resourceSlug="schedule" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Schedule a Meeting with Me
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Prefer a self-serve calendar when available; the form below always
          records your request in the portfolio database for follow-up.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-xl font-semibold">Calendar</h2>
            {embed ? (
              <div className="aspect-[4/5] min-h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <iframe
                  title="Scheduling"
                  src={embed}
                  className="h-full w-full"
                  allow="camera; microphone; payment"
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-muted/40 p-8 text-sm text-muted-foreground">
                Set{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  NEXT_PUBLIC_CAL_EMBED_URL
                </code>{" "}
                to your Cal.com or Calendly embed URL. Until then, use the
                meeting request form.
              </div>
            )}
          </div>
          <div>
            <h2 className="font-heading text-xl font-semibold">
              Meeting request form
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fields mirror the specification: contact details, reason, and
              preferred timing.
            </p>
            <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
              <MeetingRequestForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
