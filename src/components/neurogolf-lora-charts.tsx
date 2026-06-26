"use client";

import { useEffect, useRef } from "react";
import type { NeurogolfLoraStats } from "@/lib/neurogolf-lora-research";

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
  stats: NeurogolfLoraStats;
};

export function NeurogolfLoraCharts({ stats }: Props) {
  const scoreRef = useRef<HTMLCanvasElement>(null);
  const passRef = useRef<HTMLCanvasElement>(null);
  const loraRef = useRef<HTMLCanvasElement>(null);
  const outcomesRef = useRef<HTMLCanvasElement>(null);
  const chartsRef = useRef<{ destroy: () => void }[]>([]);

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
      if (cancelled || !window.Chart) return;

      chartsRef.current.forEach((c) => c.destroy());
      chartsRef.current = [];

      const labels = stats.timeline.map((t) => t.label);
      const Chart = window.Chart;

      if (scoreRef.current) {
        chartsRef.current.push(
          new Chart(scoreRef.current, {
            type: "line",
            data: {
              labels,
              datasets: [
                {
                  label: "Kaggle public score",
                  data: stats.timeline.map((t) => t.kaggle),
                  borderColor: "#17345f",
                  backgroundColor: "rgba(23,52,95,0.1)",
                  tension: 0.25,
                  fill: true,
                },
              ],
            },
            options: {
              responsive: true,
              scales: { y: { beginAtZero: false } },
            },
          }),
        );
      }

      if (passRef.current) {
        chartsRef.current.push(
          new Chart(passRef.current, {
            type: "bar",
            data: {
              labels,
              datasets: [
                {
                  label: "pass_all tasks",
                  data: stats.timeline.map((t) => t.pass_all),
                  backgroundColor: "#4a7ab8",
                },
              ],
            },
            options: { responsive: true },
          }),
        );
      }

      const adapterKeys = Object.keys(stats.adapters);
      if (loraRef.current) {
        chartsRef.current.push(
          new Chart(loraRef.current, {
            type: "bar",
            data: {
              labels: adapterKeys.map((k) => stats.adapters[k].display),
              datasets: [
                {
                  label: "Training examples",
                  data: adapterKeys.map((k) => stats.adapters[k].examples),
                  backgroundColor: "#2d8a6e",
                },
                {
                  label: "MLX train rows",
                  data: adapterKeys.map((k) => stats.adapters[k].mlx_train_rows),
                  backgroundColor: "#6bb89a",
                },
              ],
            },
            options: { responsive: true },
          }),
        );
      }

      if (outcomesRef.current) {
        const oc = stats.outcomes;
        chartsRef.current.push(
          new Chart(outcomesRef.current, {
            type: "doughnut",
            data: {
              labels: Object.keys(oc),
              datasets: [
                {
                  data: Object.values(oc),
                  backgroundColor: ["#2d8a6e", "#c9a227", "#c44", "#888"],
                },
              ],
            },
            options: { responsive: true },
          }),
        );
      }
    }

    void render();
    return () => {
      cancelled = true;
      chartsRef.current.forEach((c) => c.destroy());
    };
  }, [stats]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 font-medium">Kaggle score timeline</h3>
        <canvas ref={scoreRef} className="max-h-72" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 font-medium">pass_all tasks</h3>
        <canvas ref={passRef} className="max-h-72" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 font-medium">LoRA synthetic dataset growth</h3>
        <canvas ref={loraRef} className="max-h-72" />
      </div>
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 font-medium">Submission outcomes vs prior</h3>
        <canvas ref={outcomesRef} className="max-h-72" />
      </div>
    </div>
  );
}
