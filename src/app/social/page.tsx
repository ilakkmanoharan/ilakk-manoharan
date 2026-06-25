import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { ViewTracker } from "@/components/view-tracker";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatSocialDate,
  loadSocialPosts,
} from "@/lib/social";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Social",
  description:
    "Posts from Ilak Manoharan on X, LinkedIn, and this portfolio — synced when new content is committed to the social folder.",
};

function renderBody(body: string) {
  return body.split("\n").map((line, index) => {
    const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
    if (urlMatch) {
      const [before, after] = [
        line.slice(0, urlMatch.index),
        line.slice((urlMatch.index ?? 0) + urlMatch[0].length),
      ];
      return (
        <span key={index}>
          {before}
          <a
            href={urlMatch[0]}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            {urlMatch[0]}
          </a>
          {after}
          {index < body.split("\n").length - 1 ? <br /> : null}
        </span>
      );
    }
    return (
      <span key={index}>
        {line}
        {index < body.split("\n").length - 1 ? <br /> : null}
      </span>
    );
  });
}

export default function SocialPage() {
  const posts = loadSocialPosts();

  return (
    <>
      <ViewTracker path="/social" resourceType="page" resourceSlug="social" />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Social
        </h1>
        <p className="mt-3 text-muted-foreground">
          Posts published to{" "}
          <a
            href={siteConfig.links.x}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            X
          </a>
          ,{" "}
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            LinkedIn
          </a>
          , and this site. Add a file to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">social/</code>{" "}
          in GitHub to trigger the publish agent.
        </p>

        {posts.length === 0 ? (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="text-lg">No posts yet</CardTitle>
              <CardDescription>
                Commit a markdown or JSON card to the{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  social/
                </code>{" "}
                folder to publish.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="mt-10 space-y-8">
            {posts.map((post) => (
              <Card
                key={post.id}
                id={post.slug}
                className="scroll-mt-24 border-border/80"
              >
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-normal">
                      {formatSocialDate(post.publishedAt)} UTC
                    </Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                  {post.title ? (
                    <CardTitle className="font-heading text-xl leading-snug">
                      {post.title}
                    </CardTitle>
                  ) : null}
                </CardHeader>
                <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <div className="whitespace-pre-wrap text-foreground/90">
                    {renderBody(post.body)}
                  </div>

                  <div className="flex flex-wrap gap-4 border-t border-border/60 pt-4 text-sm">
                    {post.x?.url ? (
                      <a
                        href={post.x.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-3.5" aria-hidden />
                        View on X
                      </a>
                    ) : null}
                    {post.linkedin?.url ? (
                      <a
                        href={post.linkedin.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-3.5" aria-hidden />
                        View on LinkedIn
                      </a>
                    ) : null}
                    {post.link ? (
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-3.5" aria-hidden />
                        Link
                      </a>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <p className="mt-10 text-sm text-muted-foreground">
          <Link href="/" className="text-primary hover:underline">
            ← Home
          </Link>
        </p>
      </div>
    </>
  );
}
