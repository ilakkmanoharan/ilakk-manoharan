import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { asStringArray } from "@/lib/json";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const skill = await prisma.skill.findUnique({ where: { slug } });
  if (!skill) return { title: "Skill" };
  return {
    title: skill.name,
    description: skill.overview.slice(0, 155),
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { slug } = await params;
  const skill = await prisma.skill.findUnique({
    where: { slug },
    include: { experiences: { orderBy: { id: "asc" } } },
  });
  if (!skill) notFound();

  const tools = asStringArray(skill.tools);
  const examples = asStringArray(skill.examples);
  const videos = asStringArray(skill.videoUrls);
  const gh = asStringArray(skill.githubLinks);

  return (
    <>
      <ViewTracker
        path={`/skills/${slug}`}
        resourceType="skill"
        resourceSlug={slug}
      />
      <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-sm text-muted-foreground">
          <Link href="/skills" className="hover:text-foreground hover:underline">
            Skills
          </Link>{" "}
          / {skill.category}
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">
          {skill.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{skill.overview}</p>
        <p className="mt-6 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Years of experience: </span>
          {skill.yearsExperience}
        </p>

        <section className="mt-10 space-y-4">
          <h2 className="font-heading text-xl font-semibold">Tools / frameworks</h2>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-heading text-xl font-semibold">Examples of work</h2>
          <ul className="list-inside list-disc text-sm text-muted-foreground">
            {examples.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-heading text-xl font-semibold">
            Professional experience
          </h2>
          <div className="space-y-4">
            {skill.experiences.map((ex) => (
              <Card key={ex.id} className="border-border/80">
                <CardHeader>
                  <CardTitle className="text-base">
                    {ex.role} · {ex.organization}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{ex.summary}</p>
                  <p className="mt-2 text-xs">
                    {ex.startYear ?? "?"} — {ex.endYear ?? "Present"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {videos.length ? (
          <section className="mt-10 space-y-4">
            <h2 className="font-heading text-xl font-semibold">
              Videos / explanations
            </h2>
            <ul className="list-inside list-disc text-sm">
              {videos.map((v) => (
                <li key={v}>
                  <a href={v} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    {v}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {gh.length ? (
          <section className="mt-10 space-y-4">
            <h2 className="font-heading text-xl font-semibold">GitHub</h2>
            <ul className="list-inside list-disc text-sm">
              {gh.map((g) => (
                <li key={g}>
                  <a href={g} className="text-primary hover:underline" target="_blank" rel="noreferrer">
                    {g}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
