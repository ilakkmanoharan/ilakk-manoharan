"use client";

import { siteConfig } from "@/lib/site";

export function IntroVideo() {
  const id = siteConfig.introVideoId?.trim();
  if (!id) {
    return (
      <div className="flex aspect-video w-full max-w-3xl flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/40 px-6 text-center">
        <p className="text-sm font-medium text-foreground">
          Intro video placeholder
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            NEXT_PUBLIC_INTRO_VIDEO_ID
          </code>{" "}
          to your YouTube video ID to embed it here.
        </p>
      </div>
    );
  }
  return (
    <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-xl border border-border shadow-lg shadow-primary/5">
      <iframe
        title="Introductory video from Ilak"
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
