"use client";

import { useEffect, useRef } from "react";
import type { ArcAgi3ScoreHistory } from "@/lib/arc-agi-3-research";

declare global {
  interface Window {
    Chart?: {
      new (
        ctx: CanvasRenderingContext2D | HTMLCanvasElement,
        config: unknown,
      ): { destroy: () => void };
    };
  }
}

type Props = {
  history: ArcAgi3ScoreHistory;
};

export function ArcAgi3ScoreChart({ history }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function render() {
      if (!window.Chart) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src =
            "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Chart.js load failed"));
          document.head.appendChild(s);
        });
      }
      if (cancelled || !window.Chart || !canvasRef.current) return;

      chartRef.current?.destroy();

      const labels = history.points.map((p) =>
        new Date(p.timestamp).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Chicago",
        }),
      );

      chartRef.current = new window.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Public score",
              data: history.points.map((p) => p.score),
              borderColor: "#1f3a5f",
              backgroundColor: "rgba(31,58,95,0.12)",
              tension: 0.2,
              fill: true,
              pointRadius: 4,
              pointBackgroundColor: history.points.map((p) =>
                p.isAllTimeBest ? "#b45309" : "#1f3a5f",
              ),
            },
            {
              label: "Cumulative best",
              data: history.points.map((p) => p.cumulativeBest),
              borderColor: "#4a7ab8",
              borderDash: [6, 4],
              tension: 0.15,
              fill: false,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                afterBody: (items: { dataIndex: number }[]) => {
                  const i = items[0]?.dataIndex;
                  if (i === undefined) return [];
                  const p = history.points[i];
                  return [
                    `Ref: ${p.submissionRef}`,
                    p.description ?? "",
                    p.isAllTimeBest ? "All-time best" : "",
                  ].filter(Boolean);
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: false,
              title: { display: true, text: "Public score" },
            },
          },
        },
      });
    }

    void render();
    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [history]);

  if (history.points.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No scored submissions recorded yet.
      </p>
    );
  }

  const summary = `Public score history with ${history.points.length} submissions. Best ${history.bestPublicScore ?? "n/a"} on ${history.bestScoreDate ?? "n/a"}.`;

  return (
    <div>
      <p className="sr-only">{summary}</p>
      <div className="h-64 w-full md:h-80">
        <canvas ref={canvasRef} aria-label={summary} />
      </div>
    </div>
  );
}
