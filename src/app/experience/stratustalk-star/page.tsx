import type { Metadata } from "next";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import { Badge } from "@/components/ui/badge";
import { StratusTalkStarVideoPlayer } from "@/components/stratustalk-star-video-player";
import { stratustalkStarEpisodes } from "@/lib/stratustalk-star-videos";

export const metadata: Metadata = {
  title: "StratusTalk STAR challenge videos",
  description:
    "Seventeen interview-style STAR walkthroughs from contract ML work at StratusTalk Inc — LoRA fine-tuning, Mode C eval, sipagent policy tags, and self-hosted voice AI receptionists.",
};

function MdBlock({ text }: { text: string }) {
  // Lightweight markdown: bold + inline code only (content is controlled).
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={i} className="font-medium text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={i}
              className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </p>
  );
}

export default function StratusTalkStarVideosPage() {
  return (
    <>
      <ViewTracker
        path="/experience/stratustalk-star"
        resourceType="page"
        resourceSlug="stratustalk-star"
      />
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">AI / ML</Badge>
          <Badge variant="secondary">Voice AI</Badge>
          <Badge variant="secondary">LoRA / PEFT</Badge>
          <Badge variant="secondary">Interview STAR</Badge>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          StratusTalk STAR challenge videos
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Seventeen walkthroughs from contract ML engineering at{" "}
          <Link href="/experience" className="text-primary hover:underline">
            StratusTalk Inc
          </Link>
          : policy-constrained voice receptionists, synthetic multi-turn data,
          Unsloth LoRA on GPU, vLLM serve, and sipagent-faithful holdout eval.
          Each episode is a first-person STAR you can play as narration or read
          as a transcript.
        </p>

        <nav
          aria-label="Episode list"
          className="mt-8 rounded-xl border border-border bg-muted/30 p-4"
        >
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Playlist · {stratustalkStarEpisodes.length} episodes
          </p>
          <ol className="mt-3 grid gap-1 sm:grid-cols-2">
            {stratustalkStarEpisodes.map((ep) => (
              <li key={ep.id}>
                <a
                  href={`#${ep.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  <span className="font-mono text-xs text-muted-foreground">
                    {ep.epLabel}
                  </span>{" "}
                  {ep.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-16">
          {stratustalkStarEpisodes.map((ep) => (
            <article
              key={ep.id}
              id={ep.id}
              className="scroll-mt-24 border-t border-border pt-10 first:border-t-0 first:pt-0"
            >
              <StratusTalkStarVideoPlayer episode={ep} />

              <div className="mt-6 space-y-5">
                {ep.oneLiner ? (
                  <blockquote className="border-l-2 border-emerald-600/70 pl-4 text-sm leading-relaxed text-foreground">
                    {ep.oneLiner}
                  </blockquote>
                ) : null}

                <section>
                  <h2 className="font-heading text-base font-semibold">
                    Opening
                  </h2>
                  <div className="mt-2">
                    <MdBlock text={ep.opening} />
                  </div>
                </section>
                <section>
                  <h2 className="font-heading text-base font-semibold">
                    Situation / Problem
                  </h2>
                  <div className="mt-2">
                    <MdBlock text={ep.situation} />
                  </div>
                </section>
                <section>
                  <h2 className="font-heading text-base font-semibold">
                    What I Did
                  </h2>
                  <div className="mt-2">
                    <MdBlock text={ep.approach} />
                  </div>
                </section>
                <section>
                  <h2 className="font-heading text-base font-semibold">
                    Outcome / Impact
                  </h2>
                  <div className="mt-2">
                    <MdBlock text={ep.outcome} />
                  </div>
                </section>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-16 text-sm text-muted-foreground">
          Also see architecture docs:{" "}
          <a
            href="/voxlayer/index.html"
            className="text-primary hover:underline"
          >
            dataset generation v1
          </a>
          {" · "}
          <a
            href="/voxlayer-v2/index.html"
            className="text-primary hover:underline"
          >
            dataset generation v2
          </a>
          {" · "}
          <Link href="/experience" className="text-primary hover:underline">
            Professional experience
          </Link>
        </p>
      </div>
    </>
  );
}
