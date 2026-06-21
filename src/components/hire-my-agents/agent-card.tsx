import Link from "next/link";
import type { HireAgent } from "@/lib/hire-my-agents/data";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AgentCardProps = {
  agent: HireAgent;
  compact?: boolean;
  className?: string;
};

export function AgentCard({ agent, compact = false, className }: AgentCardProps) {
  const href = `#agent-${agent.id}`;

  return (
    <Card
      className={cn(
        "group overflow-hidden border-border/80 bg-card/80 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        className,
      )}
    >
      <CardHeader className={cn("pb-3", compact && "p-4 pb-2")}>
        <div
          className={cn(
            "mb-3 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-inner",
            agent.accent,
          )}
          aria-hidden
        >
          {agent.avatarEmoji}
        </div>
        <CardTitle className="font-heading text-lg">{agent.name}</CardTitle>
        <CardDescription className="text-sm font-medium text-foreground/80">
          {agent.role}
        </CardDescription>
        {!compact ? (
          <p className="pt-1 text-sm text-muted-foreground">{agent.description}</p>
        ) : (
          <p className="pt-1 text-xs text-muted-foreground">{agent.tagline}</p>
        )}
      </CardHeader>
      <CardContent className={cn("pt-0", compact && "p-4 pt-0")}>
        {!compact && (
          <ul className="mb-4 flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <li
                key={cap}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {cap}
              </li>
            ))}
          </ul>
        )}
        <Link
          href={href}
          className={cn(
            buttonVariants({ size: "sm" }),
            "w-full bg-[#0f172a] hover:bg-[#1e293b]",
          )}
        >
          Chat with {agent.name}
        </Link>
      </CardContent>
    </Card>
  );
}
