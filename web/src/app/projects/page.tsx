import type { Metadata } from "next";
import { ProjectGrid } from "@/components/project-grid";
import { ViewTracker } from "@/components/view-tracker";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Professional and technical projects across AI systems, backends, and full-stack product work.",
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <>
      <ViewTracker path="/projects" resourceType="page" resourceSlug="projects" />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Projects
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          A filterable view of shipped work, prototypes, and technical deep
          dives—each card links out where the work is public.
        </p>
        <div className="mt-10">
          <ProjectGrid projects={projects} />
        </div>
      </div>
    </>
  );
}
