import type { Metadata } from "next";
import { ViewTracker } from "@/components/view-tracker";
import { ProjectGrid } from "@/components/project-grid";
import { loadExperienceForPage } from "@/lib/experience-content";

export const metadata: Metadata = {
  title: "Professional Experience",
  description:
    "Contract and professional engineering work — systems shipped in production with architecture docs and open artifacts.",
};

export default async function ExperiencePage() {
  const items = loadExperienceForPage();

  return (
    <>
      <ViewTracker
        path="/experience"
        resourceType="page"
        resourceSlug="experience"
      />
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <h1 className="font-heading text-4xl font-semibold tracking-tight">
          Professional Experience
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Contract and client engineering — shipped CLIs, validators, cluster
          deployments, and architecture you can click through.
        </p>
        <div className="mt-10">
          <ProjectGrid projects={items} />
        </div>
      </div>
    </>
  );
}
