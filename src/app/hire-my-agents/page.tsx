import type { Metadata } from "next";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import { AgentCard } from "@/components/hire-my-agents/agent-card";
import { BrainGraph } from "@/components/hire-my-agents/brain-graph";
import { CTASection } from "@/components/hire-my-agents/cta-section";
import { WorkflowStep } from "@/components/hire-my-agents/workflow-step";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  agentTeams,
  approvalExamples,
  architectureBlocks,
  companyBrainNodes,
  featuredAgents,
  heroAgents,
  personalBrainBlocks,
  personalBrainNodes,
  reportExamples,
  trustPoints,
  workflowSteps,
} from "@/lib/hire-my-agents/data";

export const metadata: Metadata = {
  title: "Hire My Agents",
  description:
    "Hire AI agents that actually do the work — engineers, assistants, researchers, security teams, and full AI departments with memory, tools, workflows, and daily reporting.",
};

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#0f172a] md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default function HireMyAgentsPage() {
  return (
    <>
      <ViewTracker path="/hire-my-agents" resourceType="page" resourceSlug="hire-my-agents" />
      <div className="bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-24 md:pt-20">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">AI workforce</Badge>
            <Badge variant="secondary">Agent-native</Badge>
            <Badge variant="secondary">Daily reporting</Badge>
          </div>
          <div className="mt-8 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#0f172a] md:text-5xl lg:text-6xl">
                Hire AI agents that actually do the work.
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Browse a workforce of intelligent agents — engineers, assistants,
                recruiters, product managers, researchers, designers, finance agents, social
                media managers, AI security agents, and red teams — each with memory, tools,
                workflows, and daily reporting.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="#agents"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "bg-[#0f172a] hover:bg-[#1e293b]",
                  )}
                >
                  Hire My Agents
                </Link>
                <Link
                  href="#agents"
                  className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
                >
                  Browse Agent Workforce
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {heroAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} compact />
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-border/60 bg-white/70 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Describe the job. The agents execute. You review the results."
            />
            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {workflowSteps.map((step) => (
                <WorkflowStep
                  key={step.step}
                  step={step.step}
                  title={step.title}
                  description={step.description}
                  className={step.step === 5 ? "md:col-span-2 lg:col-span-1" : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Featured agents */}
        <section id="agents" className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Featured agents"
              description="Each agent scopes the job in chat, connects your tools, executes workflows, and reports results daily."
            />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredAgents.map((agent) => (
                <div key={agent.id} id={`agent-${agent.id}`}>
                  <AgentCard agent={agent} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Personal Brain */}
        <section className="border-y border-border/60 bg-white/70 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Every user gets a Personal Brain."
              description="Hire My Agents maintains a persistent memory layer for each user. Agents remember preferences, goals, projects, meetings, documents, decisions, contacts, workflows, and communication style."
            />
            <div className="mt-10">
              <BrainGraph
                root="User"
                nodes={personalBrainNodes}
                blocks={personalBrainBlocks}
                highlight="The more the agents work with you, the better they understand how to help you."
              />
            </div>
          </div>
        </section>

        {/* Company Brain */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Companies get a shared Company Brain."
              description="The Company Brain becomes the living memory of the organization. It stores strategy, products, customers, policies, architecture, meeting transcripts, product roadmaps, design decisions, research findings, sales conversations, support tickets, incidents, and metrics."
            />
            <div className="mt-10">
              <BrainGraph
                root="Company"
                nodes={companyBrainNodes}
                highlight="New agents can immediately understand what the company does, what has already been tried, why decisions were made, and what needs to happen next."
              />
            </div>
          </div>
        </section>

        {/* Agent teams */}
        <section className="border-y border-border/60 bg-white/70 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading title="Hire one agent or an entire AI department." />
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {agentTeams.map((team) => (
                <Card key={team.title} className="border-border/80 bg-card/80 shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-heading text-xl">{team.title}</CardTitle>
                    <CardDescription>Includes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {team.members.map((m) => (
                        <li key={m}>• {m}</li>
                      ))}
                    </ul>
                    <p className="mt-4 rounded-lg bg-muted/60 px-3 py-2 text-sm font-medium text-foreground">
                      {team.outcome}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Approval workflows */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Autonomous execution with human approval where it matters."
              description="Agents can work independently, but sensitive actions require approval."
            />
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <ul className="space-y-3 text-sm text-muted-foreground">
                {approvalExamples.map((ex) => (
                  <li key={ex} className="flex gap-2">
                    <span className="text-[#0f172a]">✓</span>
                    {ex}
                  </li>
                ))}
              </ul>
              <div className="rounded-2xl border border-border/80 bg-card p-6 font-mono text-sm">
                <p className="text-muted-foreground">Agent drafts</p>
                <p className="ml-4 text-muted-foreground">→ User receives email/SMS approval request</p>
                <p className="ml-4 text-muted-foreground">→ User approves</p>
                <p className="ml-4 text-muted-foreground">→ Agent executes</p>
                <p className="ml-4 font-medium text-foreground">→ Agent reports results</p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily reports */}
        <section className="border-y border-border/60 bg-white/70 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading
              title="Go on vacation. Come back to results."
              description="Assign outcomes and receive daily progress without micromanaging every task. Agents send clear reports with completed work, metrics, blockers, recommendations, and next steps."
            />
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {reportExamples.map((report) => (
                <span
                  key={report}
                  className="rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground shadow-sm"
                >
                  {report}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading title="Built as an agent-native operating system for work." />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {architectureBlocks.map((block) => (
                <Card key={block.title} className="border-border/80 bg-card/80">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-heading text-lg">{block.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {block.items.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="border-y border-border/60 bg-white/70 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 md:px-6">
            <SectionHeading title="Designed for controlled autonomy." />
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {trustPoints.map((point) => (
                <div
                  key={point}
                  className="rounded-xl border border-border/80 bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm"
                >
                  {point}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
          <CTASection
            id="contact"
            headline="Your next team member might be an agent."
            subheadline="Hire specialized AI agents with memory, tools, avatars, workflows, reports, and measurable outcomes."
            primaryHref="mailto:ilakkmanoharan@gmail.com?subject=Hire%20My%20Agents"
            secondaryHref="#agents"
          />
        </section>
      </div>
    </>
  );
}
