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
  const hasCalendar = Boolean(embed);

  return (
    <>
      <ViewTracker path="/schedule" resourceType="page" resourceSlug="schedule" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Schedule a Meeting with Me
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {hasCalendar
            ? "Pick a time on the calendar or submit the form — both routes notify Ilak for follow-up."
            : "Submit your preferred date and time below. Ilak will confirm or propose alternate times by email."}
        </p>

        <div
          className={
            hasCalendar
              ? "mt-10 grid gap-10 lg:grid-cols-2"
              : "mt-10 mx-auto max-w-xl"
          }
        >
          {hasCalendar ? (
            <div className="space-y-4">
              <h2 className="font-heading text-xl font-semibold">Calendar</h2>
              <div className="aspect-[4/5] min-h-[560px] w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <iframe
                  title="Scheduling"
                  src={embed}
                  className="h-full w-full"
                  allow="camera; microphone; payment"
                />
              </div>
            </div>
          ) : null}
          <div>
            {hasCalendar ? (
              <h2 className="font-heading text-xl font-semibold">
                Meeting request form
              </h2>
            ) : null}
            <p className={`text-sm text-muted-foreground ${hasCalendar ? "mt-2" : ""}`}>
              Contact details, reason for the meeting, and your preferred timing.
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
