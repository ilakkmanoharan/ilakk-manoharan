import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { ProjectGrid } from "@/components/project-grid";
import { ProjectProposalWriteups } from "@/components/project-proposal-writeups";
import { ViewTracker } from "@/components/view-tracker";
import { parseGrantProposals } from "@/lib/parse-grant-proposals";
import { DEFAULT_APP_STORE_BY_PROJECT_SLUG } from "@/lib/project-default-links";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Professional and technical projects across AI systems, backends, and full-stack product work.",
};

function loadGrantProposalsFromDisk() {
  const file = path.join(
    process.cwd(),
    "content",
    "projects",
    "grant-proposals",
    "proposals.md",
  );
  if (!fs.existsSync(file)) return [];
  const raw = fs.readFileSync(file, "utf8");
  return parseGrantProposals(raw);
}

export default async function ProjectsPage() {
  const [rows, grantProposals] = await Promise.all([
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
    }),
    Promise.resolve(loadGrantProposalsFromDisk()),
  ]);

  const projects = rows.map((p) => ({
    ...p,
    appStoreUrl:
      p.appStoreUrl ?? DEFAULT_APP_STORE_BY_PROJECT_SLUG[p.slug] ?? null,
  }));

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
        <ProjectProposalWriteups proposals={grantProposals} />
      </div>
    </>
  );
}
