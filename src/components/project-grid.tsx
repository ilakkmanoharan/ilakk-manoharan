"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/generated/prisma";
import { asStringArray } from "@/lib/json";
import { DEFAULT_APP_STORE_BY_PROJECT_SLUG } from "@/lib/project-default-links";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const FILTERS = [
  "AI / ML",
  "Backend",
  "Full Stack",
  "Mobile",
  "Cloud",
  "Scientific AI",
  "Open Source",
  "Distributed Systems",
  "Patents",
] as const;

function appStoreUrlFor(project: Project): string | null {
  return (
    project.appStoreUrl ??
    DEFAULT_APP_STORE_BY_PROJECT_SLUG[project.slug] ??
    null
  );
}

export function ProjectGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!active) return projects;
    return projects.filter((p) =>
      asStringArray(p.filterTags).includes(active),
    );
  }, [active, projects]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={active === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActive(null)}
        >
          All
        </Button>
        {FILTERS.map((f) => (
          <Button
            key={f}
            type="button"
            variant={active === f ? "default" : "outline"}
            size="sm"
            onClick={() => setActive(f)}
          >
            {f}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((p) => {
          const appStoreUrl = appStoreUrlFor(p);
          return (
          <Card
            key={p.id}
            className="group border-border/80 transition-all hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
          >
            <CardHeader>
              <div className="flex flex-wrap gap-1.5">
                {asStringArray(p.filterTags).map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
              </div>
              <CardTitle className="font-heading text-xl">{p.title}</CardTitle>
              <CardDescription className="line-clamp-3">
                {p.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">Role: </span>
                {p.role}
              </p>
              <p>
                <span className="text-muted-foreground">Status: </span>
                {p.status}
              </p>
              <p className="text-muted-foreground">
                Stack: {asStringArray(p.techStack).join(", ")}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {p.githubUrl ? (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    GitHub
                  </a>
                ) : null}
                {appStoreUrl ? (
                  <a
                    href={appStoreUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    App Store
                  </a>
                ) : null}
                {p.websiteUrl ? (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden />
                    Website
                  </a>
                ) : null}
                {p.demoVideoUrl ? (
                  <a
                    href={p.demoVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Demo video
                  </a>
                ) : null}
                {p.caseStudyUrl ? (
                  <a
                    href={p.caseStudyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {p.caseStudyUrl.toLowerCase().endsWith(".pdf")
                      ? "PDF"
                      : "Case study"}
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No projects match this filter yet.
        </p>
      ) : null}
    </div>
  );
}
