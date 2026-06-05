import Link from "next/link";
import type { Metadata } from "next";
import { AdminSignOut } from "@/components/admin-sign-out";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    startupInterestCount,
    recruiterCount,
    contactCount,
    meetingCount,
    projects,
    startups,
    hackathons,
    founderItems,
    skills,
    newsletterLogs,
  ] = await Promise.all([
    prisma.startupInterestSubmission.count(),
    prisma.recruiterMessage.count(),
    prisma.contactMessage.count(),
    prisma.meetingRequest.count(),
    prisma.project.count(),
    prisma.startup.count(),
    prisma.hackathon.count(),
    prisma.founderStudioItem.count(),
    prisma.skill.count(),
    prisma.newsletterLog.findMany({
      orderBy: { sentAt: "desc" },
      take: 5,
    }),
  ]);

  const recentInterest = await prisma.startupInterestSubmission.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold">Admin dashboard</h1>
        <AdminSignOut />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Submissions and catalog counts. Edit seed data in{" "}
        <code className="rounded bg-muted px-1 text-xs">prisma/seed.ts</code>{" "}
        or connect a CMS later.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Startup interest" value={startupInterestCount} />
        <Stat label="Recruiter messages" value={recruiterCount} />
        <Stat label="Contact messages" value={contactCount} />
        <Stat label="Meeting requests" value={meetingCount} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat label="Projects (CMS)" value={projects} />
        <Stat label="Startups" value={startups} />
        <Stat label="Hackathons" value={hackathons} />
        <Stat label="Founder Studio" value={founderItems} />
        <Stat label="Skills" value={skills} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent startup interest</CardTitle>
            <CardDescription>Latest submissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {recentInterest.map((r) => (
              <div key={r.id} className="border-b border-border pb-3 last:border-0">
                <p className="font-medium">
                  {r.startupName}{" "}
                  <span className="text-muted-foreground">— {r.name}</span>
                </p>
                <p className="text-xs text-muted-foreground">{r.email}</p>
              </div>
            ))}
            {recentInterest.length === 0 ? (
              <p className="text-muted-foreground">No submissions yet.</p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Newsletter / cron logs</CardTitle>
            <CardDescription>Daily summary job outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {newsletterLogs.map((l) => (
              <div key={l.id}>
                <p>
                  {l.sentAt.toISOString().slice(0, 10)}{" "}
                  <span
                    className={
                      l.success ? "text-primary" : "text-destructive"
                    }
                  >
                    {l.success ? "ok" : "failed"}
                  </span>
                </p>
                {l.errorMessage ? (
                  <p className="text-xs text-muted-foreground">{l.errorMessage}</p>
                ) : null}
              </div>
            ))}
            {newsletterLogs.length === 0 ? (
              <p className="text-muted-foreground">No runs yet.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Public views:{" "}
        <Link className="text-primary hover:underline" href="/projects">
          Projects
        </Link>
        ,{" "}
        <Link className="text-primary hover:underline" href="/startups">
          Startups
        </Link>
        ,{" "}
        <Link className="text-primary hover:underline" href="/founder-studio">
          Founder Studio
        </Link>
        ,{" "}
        <Link className="text-primary hover:underline" href="/admin/agent">
          Agent invites
        </Link>
        .
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-semibold">{value}</p>
    </div>
  );
}
