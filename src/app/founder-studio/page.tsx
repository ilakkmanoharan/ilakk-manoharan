import type { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadFounderStudioForPage } from "@/lib/founder-studio-content";

export const metadata: Metadata = {
  title: "Founder Studio",
  description:
    "Video and writing library: project walkthroughs, interview answers, founder reflections, and technical narratives.",
};

export default async function FounderStudioPage() {
  const items = loadFounderStudioForPage();

  return (
    <>
      <ViewTracker
        path="/founder-studio"
        resourceType="page"
        resourceSlug="founder-studio"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Founder Studio
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A calm library of explanations and founder notes—organized by
          category so you can skim or go deep.
        </p>
        <div className="mt-10 grid gap-8">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden border-border/80">
              <CardHeader>
                <Badge variant="secondary">{item.category}</Badge>
                <CardTitle className="font-heading text-2xl">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.summary}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                {item.youtubeId ? (
                  <div className="aspect-video overflow-hidden rounded-lg border border-border">
                    <iframe
                      title={item.title}
                      className="h-full w-full"
                      src={`https://www.youtube-nocookie.com/embed/${item.youtubeId}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-sm text-muted-foreground">
                    Video coming soon
                  </div>
                )}
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Transcript / text</p>
                    <p className="mt-1 whitespace-pre-wrap text-muted-foreground">
                      {item.transcript}
                    </p>
                  </div>
                  {item.relatedProjectSlug ? (
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Related project:{" "}
                      </span>
                      {item.relatedProjectSlug}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Related skills:{" "}
                    </span>
                    {item.relatedSkills.join(", ")}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
