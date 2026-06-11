import type { Metadata } from "next";
import Link from "next/link";
import { ViewTracker } from "@/components/view-tracker";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildSkillsProjectIndex } from "@/lib/project-skills-index";

export const metadata: Metadata = {
  title: "Projects by Skill",
  description:
    "Ilak's shipped projects grouped by technical skill — ML, backend, cloud, Python, TypeScript, Scientific AI, and more.",
};

export default function SkillsProjectsPage() {
  const index = buildSkillsProjectIndex();

  return (
    <>
      <ViewTracker
        path="/skills/projects"
        resourceType="page"
        resourceSlug="skills-projects"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm text-muted-foreground">
          <Link href="/skills" className="text-primary hover:underline">
            Skills
          </Link>
          <span className="mx-2">/</span>
          <span>Projects by skill</span>
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight">
          Projects by skill
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Every project on the portfolio is tagged with the skills it demonstrates —
          derived from tech stack, architecture, and delivery role. Use this index
          to answer &ldquo;Does Ilak have X?&rdquo; or &ldquo;Which projects
          involve Y?&rdquo; Ilak&apos;s general-Agent1 uses the same mapping in
          its knowledge graph.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          {index.skillCount} skills · {index.projectCount} projects indexed
        </p>

        <div className="mt-10 space-y-10">
          {index.skills.map((group) => (
            <section key={group.skillId} id={group.skillId}>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-heading text-2xl font-semibold">
                  {group.skillLabel}
                </h2>
                <Badge variant="secondary">{group.category}</Badge>
                {group.yearsExperience != null ? (
                  <Badge variant="outline">
                    {group.yearsExperience}+ years
                  </Badge>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                <Link
                  href={group.skillPageUrl.replace(
                    "https://ilakk-manoharan.vercel.app",
                    "",
                  )}
                  className="text-primary hover:underline"
                >
                  Skill detail page
                </Link>
                {" · "}
                {group.projects.length} project
                {group.projects.length === 1 ? "" : "s"}
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {group.projects.map((p) => (
                  <Card key={p.slug} className="border-border/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="font-heading text-lg">
                        {p.title}
                      </CardTitle>
                      <CardDescription>{p.status}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">
                        Evidence
                      </p>
                      <ul className="mt-1 list-inside list-disc space-y-0.5">
                        {p.evidence.map((e) => (
                          <li key={e}>{e}</li>
                        ))}
                      </ul>
                      <Link
                        href="/projects"
                        className="mt-3 inline-block text-primary hover:underline"
                      >
                        View on Projects
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
