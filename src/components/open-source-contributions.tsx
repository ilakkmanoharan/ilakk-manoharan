import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OpenSourceOrgContribution } from "@/lib/open-source-contributions";
import { statusLabel } from "@/lib/open-source-contributions";

export function OpenSourceContributions({
  orgs,
}: {
  orgs: OpenSourceOrgContribution[];
}) {
  if (orgs.length === 0) return null;

  return (
    <section
      className="mt-16 border-t border-border pt-14"
      aria-labelledby="open-source-contributions-heading"
    >
      <h2
        id="open-source-contributions-heading"
        className="font-heading text-2xl font-semibold tracking-tight"
      >
        Open Source Contributions
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Upstream work on open-source projects—compact cards here, with a project
        page for pull-request details and status.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {orgs.map((org) => {
          const pulls = org.items.filter((i) => i.kind === "pull");
          const openCount = pulls.filter((i) => i.state === "open").length;
          const latest = pulls[0] ?? org.items[0];

          return (
            <Card
              key={org.slug}
              className="flex flex-col border-border/80 shadow-sm"
            >
              <CardHeader className="space-y-2 pb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">Open source</Badge>
                  {openCount > 0 ? (
                    <Badge variant="secondary">{openCount} open</Badge>
                  ) : null}
                </div>
                <CardTitle className="font-heading text-xl">{org.name}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {org.blurb}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-3 pt-0 text-sm">
                {latest ? (
                  <p className="text-muted-foreground">
                    Latest:{" "}
                    <a
                      href={latest.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {latest.kind === "pull" ? "PR" : "Issue"} #{latest.number}
                    </a>
                    <span className="text-muted-foreground">
                      {" "}
                      · {statusLabel(latest.state)}
                    </span>
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={org.projectPageUrl}
                    className="text-primary hover:underline"
                  >
                    Project page
                  </Link>
                  <a
                    href={org.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                    {org.repo}
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
