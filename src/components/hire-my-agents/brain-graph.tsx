import { cn } from "@/lib/utils";

type BrainGraphProps = {
  root: string;
  nodes: string[];
  blocks?: string[];
  highlight?: string;
  className?: string;
};

export function BrainGraph({
  root,
  nodes,
  blocks,
  highlight,
  className,
}: BrainGraphProps) {
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8", className)}>
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-xl bg-[#0f172a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
          {root}
        </div>
        <div className="h-6 w-px bg-border" aria-hidden />
        <div className="flex flex-wrap justify-center gap-2">
          {nodes.map((node) => (
            <span
              key={node}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground/90 shadow-sm"
            >
              → {node}
            </span>
          ))}
        </div>
      </div>
      {blocks && blocks.length > 0 ? (
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          {blocks.map((block) => (
            <div
              key={block}
              className="rounded-lg border border-dashed border-border/80 bg-muted/40 px-3 py-2 text-xs text-muted-foreground"
            >
              {block}
            </div>
          ))}
        </div>
      ) : null}
      {highlight ? (
        <p className="mt-6 text-center text-sm font-medium text-foreground/90">{highlight}</p>
      ) : null}
    </div>
  );
}
