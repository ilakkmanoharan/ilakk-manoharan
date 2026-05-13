import Link from "next/link";
import type { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Structured view of engineering strengths—each skill opens a detail page with tools, experience, and examples.",
};

const CATEGORY_ORDER = [
  "Backend Engineering",
  "Full Stack Development",
  "AI / ML Systems",
  "Cloud Infrastructure",
  "Distributed Systems",
  "Databases",
  "Product Engineering",
  "Engineering Program Management",
  "Mobile Development",
  "Scientific AI",
  "Startup Building",
] as const;

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { name: "asc" },
  });

  const grouped = new Map<string, typeof skills>();
  for (const s of skills) {
    const list = grouped.get(s.category) ?? [];
    list.push(s);
    grouped.set(s.category, list);
  }

  const categories = [
    ...CATEGORY_ORDER.filter((c) => grouped.has(c)),
    ...[...grouped.keys()].filter(
      (c) => !(CATEGORY_ORDER as readonly string[]).includes(c),
    ),
  ];

  return (
    <>
      <ViewTracker path="/skills" resourceType="page" resourceSlug="skills" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Skills
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Click a skill to see the detail page with years of experience, tools,
          representative work, and links.
        </p>
        <div className="mt-10 space-y-12">
          {categories.map((cat) => (
            <section key={cat}>
              <h2 className="font-heading text-xl font-semibold">{cat}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(grouped.get(cat) ?? []).map((s) => (
                  <Link key={s.id} href={`/skills/${s.slug}`}>
                    <Card className="h-full border-border/80 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                      <CardHeader>
                        <CardTitle className="font-heading text-lg">
                          {s.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-3">
                          {s.overview}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        {s.yearsExperience}+ years experience
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
