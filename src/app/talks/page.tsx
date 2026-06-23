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
import { talks } from "@/lib/talks";

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

export const metadata: Metadata = {
  title: "Talks",
  description:
    "Conference keynotes, panels, meetups, and invited talks on engineering, AI systems, and building products.",
};

export default function TalksPage() {
  return (
    <>
      <ViewTracker path="/talks" resourceType="page" resourceSlug="talks" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Talks
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Selected speaking engagements—add or edit entries in{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            src/lib/talks.ts
          </code>
          .
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {talks.map((t, i) => (
            <Card
              key={`${t.title}-${i}`}
              className="border-border/80 transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{t.format}</Badge>
                  <span className="text-xs text-muted-foreground">{t.date}</span>
                </div>
                <CardTitle className="font-heading text-xl leading-snug">
                  {t.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {t.event}
                  {t.location ? ` · ${t.location}` : null}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>{t.description}</p>
                <div className="flex flex-wrap gap-4">
                  {t.videoUrl ? (
                    <a
                      href={t.videoUrl}
                      {...(isExternalUrl(t.videoUrl)
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      {isExternalUrl(t.videoUrl) ? (
                        <ExternalLink className="size-4" aria-hidden />
                      ) : null}
                      Recording
                    </a>
                  ) : null}
                  {t.audioUrl ? (
                    <a
                      href={t.audioUrl}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      Audio
                    </a>
                  ) : null}
                  {t.relatedAudioUrl ? (
                    <a
                      href={t.relatedAudioUrl}
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      Related: {t.relatedAudioLabel ?? "Audio"}
                    </a>
                  ) : null}
                  {t.slidesUrl ? (
                    <a
                      href={t.slidesUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="size-4" aria-hidden />
                      Slides
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {talks.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">
            No talks listed yet. Add objects to the{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">talks</code>{" "}
            array in{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              src/lib/talks.ts
            </code>
            .
          </p>
        ) : null}

        <p className="mt-12 text-sm text-muted-foreground">
          For longer-form video and writing, see{" "}
          <Link href="/founder-studio" className="text-primary hover:underline">
            Founder Studio
          </Link>
          .
        </p>
      </div>
    </>
  );
}
