import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { GrantProposal } from "@/lib/parse-grant-proposals";
import { groupProposalsByAgency } from "@/lib/parse-grant-proposals";
import { siteConfig } from "@/lib/site";

const article = siteConfig.federalGrantProposalsArticle;

export function ProjectProposalWriteups({
  proposals,
}: {
  proposals: GrantProposal[];
}) {
  const groups = groupProposalsByAgency(proposals);

  return (
    <section
      className="mt-16 border-t border-border pt-14"
      aria-labelledby="proposal-writeups-heading"
    >
      <h2
        id="proposal-writeups-heading"
        className="font-heading text-2xl font-semibold tracking-tight"
      >
        Project proposal write-ups
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Notes on federal R&amp;D proposals—including NASA SBIR, NSF Project Pitch,
        and ISS NLRA—and how those programs map to product and research ideas.
      </p>

      <Card className="mt-8 max-w-3xl border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-lg leading-snug">
            {article.title}
          </CardTitle>
          <CardDescription>
            Full write-up on Medium (method, framing, and lessons from the 2023–2024
            cycle).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Read on Medium
            <ExternalLink className="size-4 shrink-0" aria-hidden />
          </a>

          <p className="text-sm text-muted-foreground">
            More on Medium:{" "}
            <a
              href={siteConfig.links.medium}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Profile
              <ExternalLink
                className="ml-1 inline size-3 align-text-bottom opacity-70"
                aria-hidden
              />
            </a>
          </p>
        </CardContent>
      </Card>

      {proposals.length > 0 ? (
        <Card className="mt-8 max-w-3xl border-border/80 shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Proposal repositories
            </CardTitle>
            <CardDescription>
              GitHub repos for NLRA, NSF Project Pitch, and NASA SBIR submissions
              (sources synced from your proposals list).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {groups.map(({ agency, items }) => (
              <div key={agency}>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {agency}
                </h3>
                <ul className="mt-3 space-y-5 border-l-2 border-border pl-4">
                  {items.map((p) => (
                    <li key={p.repoUrl} className="text-sm">
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-primary hover:underline"
                      >
                        {p.title}
                        <ExternalLink
                          className="ml-1 inline size-3.5 align-text-bottom opacity-70"
                          aria-hidden
                        />
                      </a>
                      {p.bullets.length > 0 ? (
                        <ul className="mt-2 list-disc space-y-1 pl-4 text-muted-foreground">
                          {p.bullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
