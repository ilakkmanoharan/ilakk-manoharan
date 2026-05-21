import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  exceptionalAbilityIntro,
  exceptionalAbilitySections,
} from "@/lib/exceptional-ability";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Evidence of Exceptional Ability",
  description:
    "Patent, federal R&D proposals, ISSRDC presentations, adaptive scientific reasoning (ASRA / Decision Biology), and shipped full-stack products.",
};

function isExternal(href: string) {
  return href.startsWith("http://") || href.startsWith("https://");
}

export default function ExceptionalAbilityPage() {
  return (
    <>
      <ViewTracker
        path="/exceptional-ability"
        resourceType="page"
        resourceSlug="exceptional-ability"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Evidence of exceptional ability
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          {exceptionalAbilityIntro}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
            Projects
          </Link>
          <Link href="/startups" className={buttonVariants({ variant: "outline" })}>
            Startup catalog
          </Link>
          <Link href="/hackathons" className={buttonVariants({ variant: "outline" })}>
            Hackathons
          </Link>
          <Link href="/talks" className={buttonVariants({ variant: "outline" })}>
            Talks
          </Link>
        </div>

        <div className="mt-12 space-y-8">
          {exceptionalAbilitySections.map((section) => (
            <Card key={section.number} className="border-border/80">
              <CardHeader>
                <Badge variant="secondary" className="w-fit">
                  Evidence {section.number}
                </Badge>
                <CardTitle className="font-heading text-2xl">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 48)} className="text-muted-foreground">
                    {p}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
                {section.hashtags?.length ? (
                  <p className="flex flex-wrap gap-2 pt-1">
                    {section.hashtags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                ) : null}
                {section.links?.length ? (
                  <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-border/60 pt-4">
                    {section.links.map((link) =>
                      isExternal(link.href) ? (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <ExternalLink className="size-4 shrink-0" aria-hidden />
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={cn(
                            "inline-flex items-center gap-1 text-primary hover:underline",
                          )}
                        >
                          {link.label}
                        </Link>
                      ),
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-border/80 bg-muted/30">
          <CardHeader>
            <CardTitle className="font-heading text-lg">
              Portfolio reference
            </CardTitle>
            <CardDescription>
              Full project and hackathon listings on this site.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm">
            <Link href="/projects" className="text-primary hover:underline">
              Projects
            </Link>
            <Link href="/hackathons" className="text-primary hover:underline">
              Hackathons
            </Link>
            <Link href="/startups" className="text-primary hover:underline">
              Startup catalog
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
