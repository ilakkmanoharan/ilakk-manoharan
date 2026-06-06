import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Prisma, PrismaClient } from "../src/generated/prisma";
import { loadFounderStudioFromMarkdown } from "./load-founder-studio-from-md";
import { loadHackathonsFromMarkdown } from "./load-hackathons-from-md";
import { loadSkillsFromMarkdown } from "./load-skills-from-md";
import { loadStartupsFromMarkdown } from "./load-startups-from-md";
import { loadProjectsFromMarkdown } from "./load-projects-from-md";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error("DATABASE_URL is required for seeding");
}
const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url }),
});

const json = (v: Prisma.InputJsonValue) => v;

async function main() {
  await prisma.pageAnalytics.deleteMany();
  await prisma.newsletterLog.deleteMany();
  await prisma.meetingRequest.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.recruiterMessage.deleteMany();
  await prisma.startupInterestSubmission.deleteMany();
  await prisma.skillExperience.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.founderStudioItem.deleteMany();
  await prisma.hackathon.deleteMany();
  await prisma.startup.deleteMany();
  await prisma.project.deleteMany();

  const projectRows = loadProjectsFromMarkdown(process.cwd());
  if (projectRows.length === 0) {
    throw new Error(
      "No projects found. Add markdown files with YAML frontmatter under content/projects/",
    );
  }
  await prisma.project.createMany({
    data: projectRows.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      techStack: json(p.techStack),
      role: p.role,
      status: p.status,
      githubUrl: p.githubUrl,
      websiteUrl: p.websiteUrl,
      appStoreUrl: p.appStoreUrl,
      demoVideoUrl: p.demoVideoUrl,
      caseStudyUrl: p.caseStudyUrl,
      filterTags: json(p.filterTags),
      featured: p.featured,
    })),
  });

  await prisma.startup.createMany({
    data: [
      {
        slug: "nature-foundation-models",
        name: "Nature Foundation Models",
        tagline:
          "Building foundation models for natural systems—Phase 1: decision biology with information-theoretic AI for cellular decision-making under uncertainty.",
        description:
          "Founder-led deck outlining a new category of foundation models trained on natural-system dynamics: multimodal scientific intelligence constrained by physics, chemistry, biology, and uncertainty—toward a programmable intelligence layer for science.",
        problem:
          "Natural systems remain hard to predict across biology, chemistry, physics, and environmental science; knowledge is fragmented across scales and modalities; discovery workflows are still slow, empirical, and trial-and-error; we lack foundational AI that learns, simulates, and reasons about governing dynamics of nature.",
        solution:
          "A stack from natural data and scientific representations through temporal/dynamics models, simulation, scientific agents, and design/discovery systems—models that learn physical and biological dynamics, model adaptive systems, simulate under uncertainty, and unify reasoning across domains. Phase 1 focuses on cells as probabilistic decision systems governed by information flow, energy constraints, physical laws, and stochastic dynamics.",
        targetUsers:
          "Biotech R&D, academic labs, scientific computing teams, environmental and materials researchers, and partners building at the intersection of AI and natural sciences",
        status: "Deck / early concept",
        websiteUrl: null,
        githubUrl: null,
        youtubeUrl: null,
        pitchDeckUrl: "/startup-catalog/Nature-Foundation-Models-v9.pdf",
      },
      {
        slug: "agentapply",
        name: "AgentApply",
        tagline:
          "The application infrastructure layer for AI agents—a programmable API and protocol to securely discover, prepare, validate, and submit applications across jobs, accelerators, grants, fellowships, and founder programs.",
        description:
          "The deck argues the application internet was built for humans manually filling forms; AgentApply is how that stack becomes programmable—schemas, endpoints, structured application packages, status and workflow APIs, and agent identity (consent, signatures, verification)—so agents interact with systems instead of driving browsers.",
        problem:
          "AI agents can browse, write code, manage workflows, and operate autonomously—but the moment they try to apply to a job, accelerator, grant, fellowship, or founder program, everything breaks. Today’s path is fragmented, repetitive, and not machine-readable: fragile automation over buttons, dynamic forms, CAPTCHAs, inconsistent layouts, and broken flows. That is not scalable infrastructure.",
        solution:
          "Evolve from human-only web forms to agent-native programmable workflows: companies expose an Agent Application Endpoint (machine-readable requirements, application schema, submit URL, supported credentials); applicant-side agents read requirements programmatically, generate structured applications, upload documents, submit, receive receipts and status, and maintain application state—with standardized application APIs, agent identity infrastructure, structured schemas, an application-package protocol, and status/workflow APIs as in the deck.",
        targetUsers:
          "Employers, startups, accelerators, universities, research labs, fellowships, and grant organizations; plus builders of AI career agents, founder agents, research agents, recruiting agents, workflow assistants, and autonomous opportunity-discovery systems",
        status: "Deck / early concept",
        websiteUrl: null,
        githubUrl: null,
        youtubeUrl: null,
        pitchDeckUrl: "/startup-catalog/AgentApply.pdf",
      },
      {
        slug: "finance-autopilot",
        name: "Finance Autopilot",
        tagline:
          "Continuous, autonomous financial operations for high-growth companies.",
        description:
          "An autonomous financial system that connects to your bank and operational tools, continuously classifies transactions, maintains a tax-aware ledger, and executes financial actions—replacing fragmented bookkeeping, tax, payroll, and payment workflows with a single system that runs continuously.",
        problem:
          "Finance is still manual, fragmented, and reactive. Startups rely on multiple tools and people to manage bookkeeping, taxes, payroll, and payments—with no system owning the full workflow.",
        solution:
          "Finance Autopilot unifies the financial lifecycle: keeps books always up to date, computes taxes in real time, and executes payments and filings automatically—with built-in controls and auditability. From raw transactions to compliant, executed financial outcomes.",
        targetUsers:
          "Startups and solo founders without finance teams; SMBs and digital businesses juggling accounting, payroll, and payments; high-growth companies needing real-time visibility and execution; individuals who want personal finance, taxes, and payments managed automatically",
        status: "Deck / early concept",
        websiteUrl: null,
        githubUrl: null,
        youtubeUrl: null,
        pitchDeckUrl: "/startup-catalog/Finance-Autopilot-v2.pdf",
      },
    ],
  });

  const hackathonRows = loadHackathonsFromMarkdown(process.cwd());
  if (hackathonRows.length === 0) {
    throw new Error(
      "No hackathons found. Add markdown files with YAML frontmatter under content/hackathons/",
    );
  }
  await prisma.hackathon.createMany({
    data: hackathonRows.map((h) => ({
      slug: h.slug,
      hackathonName: h.hackathonName,
      projectName: h.projectName,
      problemAddressed: h.problemAddressed,
      solutionSummary: h.solutionSummary,
      datasetUsed: h.datasetUsed,
      modelTech: h.modelTech,
      technicalContribution: h.technicalContribution,
      impact: h.impact,
      githubUrl: h.githubUrl,
      kaggleUrl: h.kaggleUrl,
      demoVideo: h.demoVideo,
      writeupLink: h.writeupLink,
      statusResult: h.statusResult,
    })),
  });

  await prisma.founderStudioItem.createMany({
    data: loadFounderStudioFromMarkdown(process.cwd()).map((item) => ({
      slug: item.slug,
      title: item.title,
      category: item.category,
      youtubeId: item.youtubeId,
      summary: item.summary,
      transcript: item.transcript,
      relatedProjectSlug: item.relatedProjectSlug,
      relatedSkills: json(item.relatedSkills),
    })),
  });

  for (const skill of loadSkillsFromMarkdown(process.cwd())) {
    const created = await prisma.skill.create({
      data: {
        slug: skill.slug,
        name: skill.name,
        category: skill.category,
        overview: skill.overview,
        yearsExperience: skill.yearsExperience,
        tools: json(skill.tools),
        examples: json(skill.examples),
        videoUrls: json(skill.videoUrls),
        githubLinks: json(skill.githubLinks),
      },
    });

    if (skill.experiences.length) {
      await prisma.skillExperience.createMany({
        data: skill.experiences.map((ex) => ({
          skillId: created.id,
          organization: ex.organization,
          role: ex.role,
          summary: ex.summary,
          startYear: ex.startYear,
          endYear: ex.endYear,
        })),
      });
    }
  }
}

main()
  .then(() => {
    console.log("Seed complete.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
