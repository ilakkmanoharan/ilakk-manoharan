import Link from "next/link";
import type { Metadata } from "next";
import { RecruiterChat } from "@/components/recruiter-chat";
import { RecruiterMessageForm } from "@/components/recruiter-message-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ViewTracker } from "@/components/view-tracker";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { asStringArray } from "@/lib/json";
import { Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Recruiter Portal",
  description:
    "Fast answers from Ilak’s recruiter brief, resume link, highlights, and a secure message form.",
};

export default async function RecruiterPage() {
  const [projects, skills] = await Promise.all([
    prisma.project.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.skill.findMany({ take: 8, orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <ViewTracker path="/recruiter" resourceType="page" resourceSlug="recruiter" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Recruiter Portal
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Skim the essentials, ask the assistant questions sourced from a fixed
          markdown brief, then leave a message or grab time on the calendar.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          {siteConfig.resumeUrl ? (
            <a
              href={siteConfig.resumeUrl}
              download="Ilak-Manoharan-resume.pdf"
              className={buttonVariants({ variant: "default" })}
            >
              <span className="inline-flex items-center gap-2">
                <Download className="size-4" aria-hidden />
                Download resume
              </span>
            </a>
          ) : (
            <p className="text-sm text-muted-foreground">
              Set{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                NEXT_PUBLIC_RESUME_URL
              </code>{" "}
              to enable the resume button.
            </p>
          )}
          <Link
            href="/schedule"
            className={buttonVariants({ variant: "outline" })}
          >
            Schedule a meeting
          </Link>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <RecruiterChat />
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Send a message
              </CardTitle>
              <CardDescription>
                Saved to the database and included in the daily activity summary
                email when configured.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecruiterMessageForm />
            </CardContent>
          </Card>
        </div>

        <section className="mt-14 grid gap-6 md:grid-cols-2">
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Skills summary
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-inside list-disc">
                {skills.map((s) => (
                  <li key={s.id}>{s.name}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-border/80">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Project highlights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {projects.map((p) => (
                <div key={p.id}>
                  <p className="font-medium text-foreground">{p.title}</p>
                  <p className="text-muted-foreground">{p.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {asStringArray(p.techStack).join(", ")}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-heading text-lg font-semibold">
            Experience summary
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ilak builds production systems with an eye for reliability, clear
            interfaces between services, and pragmatic AI integration. She has
            shipped backend-heavy products, led cross-functional slices, and
            communicates tradeoffs crisply to recruiters and hiring managers.
          </p>
        </section>
      </div>
    </>
  );
}
