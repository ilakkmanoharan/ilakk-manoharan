import type { Metadata } from "next";
import { StartupInterestDialog } from "@/components/startup-interest-dialog";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Startup Catalog",
  description:
    "Startup concepts and product directions Ilak is exploring—reach out if you want to collaborate.",
};

export default async function StartupsPage() {
  const startups = await prisma.startup.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <ViewTracker path="/startups" resourceType="page" resourceSlug="startups" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Startup Catalog
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Each card captures the problem, solution, and who it is for. Use the
          interest button to start a focused conversation about a specific idea.
        </p>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {startups.map((s) => (
            <Card
              key={s.id}
              className="flex flex-col border-border/80 shadow-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <Badge variant="outline" className="w-fit">
                  {s.status}
                </Badge>
                <CardTitle className="font-heading text-2xl">{s.name}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {s.tagline}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-4 text-sm">
                <div>
                  <p className="font-medium text-foreground">Problem</p>
                  <p className="mt-1 text-muted-foreground">{s.problem}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Solution</p>
                  <p className="mt-1 text-muted-foreground">{s.solution}</p>
                </div>
                <div>
                  <p className="font-medium text-foreground">Target users</p>
                  <p className="mt-1 text-muted-foreground">{s.targetUsers}</p>
                </div>
                <p className="text-muted-foreground">{s.description}</p>
                <div className="flex flex-wrap gap-3">
                  {s.websiteUrl ? (
                    <a
                      href={s.websiteUrl}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      Website
                    </a>
                  ) : null}
                  {s.githubUrl ? (
                    <a
                      href={s.githubUrl}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      GitHub
                    </a>
                  ) : null}
                  {s.youtubeUrl ? (
                    <a
                      href={s.youtubeUrl}
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      YouTube
                    </a>
                  ) : null}
                  {s.pitchDeckUrl ? (
                    <a
                      href={s.pitchDeckUrl}
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pitch deck
                    </a>
                  ) : null}
                </div>
                <div className="mt-auto border-t border-border pt-4">
                  <StartupInterestDialog startupName={s.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
