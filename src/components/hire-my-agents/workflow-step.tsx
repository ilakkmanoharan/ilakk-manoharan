import { cn } from "@/lib/utils";

type WorkflowStepProps = {
  step: number;
  title: string;
  description: string;
  className?: string;
};

export function WorkflowStep({ step, title, description, className }: WorkflowStepProps) {
  return (
    <div
      className={cn(
        "relative flex gap-4 rounded-xl border border-border/80 bg-card/80 p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0f172a] text-sm font-bold text-white">
        {step}
      </div>
      <div>
        <h3 className="font-heading text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
