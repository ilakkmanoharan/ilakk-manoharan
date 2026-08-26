"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { Pause, Play } from "lucide-react";
import type { StratusTalkStarEpisode } from "@/lib/stratustalk-star-videos";
import { Button } from "@/components/ui/button";

function plainText(md: string) {
  return md
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\d+\.\s+/gm, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

export function StratusTalkStarVideoPlayer({
  episode,
}: {
  episode: StratusTalkStarEpisode;
}) {
  const labelId = useId();
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const play = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const script = plainText(
      [
        `${episode.epLabel}. ${episode.title}.`,
        episode.oneLiner,
        episode.opening,
        episode.situation,
        episode.approach,
        episode.outcome,
      ]
        .filter(Boolean)
        .join("\n\n"),
    );
    const utter = new SpeechSynthesisUtterance(script);
    utter.rate = 1.02;
    utter.onend = () => setPlaying(false);
    utter.onerror = () => setPlaying(false);
    setPlaying(true);
    window.speechSynthesis.speak(utter);
  }, [episode]);

  const toggle = () => {
    if (playing) stop();
    else play();
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/40 text-zinc-50 shadow-sm">
      <div className="relative aspect-video">
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, #34d399 0%, transparent 40%), radial-gradient(circle at 80% 70%, #22d3ee 0%, transparent 35%)",
          }}
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6">
          <div>
            <p className="text-xs font-medium tracking-wide text-emerald-300/90 uppercase">
              {episode.epLabel} · StratusTalk STAR
            </p>
            <h3
              id={labelId}
              className="mt-2 max-w-xl font-heading text-lg font-semibold leading-snug sm:text-xl"
            >
              {episode.title}
            </h3>
            <p className="mt-2 max-w-lg text-sm text-zinc-300">
              {episode.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              size="lg"
              onClick={toggle}
              aria-labelledby={labelId}
              aria-pressed={playing}
              className="rounded-full bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
            >
              {playing ? (
                <Pause className="size-5" aria-hidden />
              ) : (
                <Play className="size-5" aria-hidden />
              )}
              {playing ? "Pause narration" : "Play video narration"}
            </Button>
            <span className="hidden text-xs text-zinc-400 sm:inline">
              Browser speech · full STAR walkthrough
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
