import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  headline: string;
  subheadline: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  id?: string;
  className?: string;
};

export function CTASection({
  headline,
  subheadline,
  primaryLabel = "Hire My Agents",
  primaryHref = "#agents",
  secondaryLabel = "Browse the Agent Workforce",
  secondaryHref = "#agents",
  id,
  className,
}: CTASectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "rounded-3xl border border-border/80 bg-gradient-to-br from-slate-900 via-[#0f172a] to-indigo-950 px-6 py-14 text-center text-white shadow-lg md:px-12 md:py-16",
        className,
      )}
    >
      <h2 className="font-heading text-3xl font-semibold tracking-tight md:text-4xl">
        {headline}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">{subheadline}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href={primaryHref}
          className={cn(buttonVariants({ size: "lg" }), "bg-white text-[#0f172a] hover:bg-slate-100")}
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className={cn(
            buttonVariants({ size: "lg", variant: "outline" }),
            "border-slate-500 bg-transparent text-white hover:bg-white/10",
          )}
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
