import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { Prisma, PrismaClient } from "../src/generated/prisma";
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
      demoVideoUrl: p.demoVideoUrl,
      caseStudyUrl: p.caseStudyUrl,
      filterTags: json(p.filterTags),
      featured: p.featured,
    })),
  });

  await prisma.startup.createMany({
    data: [
      {
        slug: "research-copilot",
        name: "Research Copilot",
        tagline: "Turn papers and lab notes into actionable experiment plans.",
        description:
          "A founder-led concept for teams running iterative science: ingest documents, propose hypotheses, and track validation.",
        problem: "Research teams lose context across tools, PDFs, and spreadsheets.",
        solution:
          "Unified workspace with citations, experiment templates, and traceable decisions.",
        targetUsers: "Biotech R&D, academic labs, climate science teams",
        status: "Exploring design partners",
        websiteUrl: null,
        githubUrl: null,
        youtubeUrl: null,
        pitchDeckUrl: null,
      },
      {
        slug: "founder-intelligence",
        name: "Founder Intelligence",
        tagline: "Operational clarity for technical founders.",
        description:
          "Dashboards and lightweight automations that connect GitHub, calendar, and fundraising pipeline.",
        problem: "Founders juggle too many signals without a single honest overview.",
        solution:
          "Opinionated defaults, weekly digest, and investor-ready snapshots from live data.",
        targetUsers: "Pre-seed to Series A technical CEOs",
        status: "MVP scoping",
        websiteUrl: null,
        githubUrl: null,
        youtubeUrl: null,
        pitchDeckUrl: null,
      },
    ],
  });

  await prisma.hackathon.createMany({
    data: [
      {
        slug: "climate-risk-vision",
        hackathonName: "Global AI Hackathon (sample)",
        projectName: "Climate Risk Vision",
        problemAddressed: "Rapid assessment of flood risk from satellite and weather data.",
        solutionSummary:
          "Fine-tuned vision backbone with geospatial features for regional risk scoring.",
        datasetUsed: "Open satellite tiles + NOAA samples",
        modelTech: "PyTorch, timm, ONNX export",
        technicalContribution: "Data pipeline, model training notebook, and API for scoring.",
        impact: "Demoed live map with explainable hotspots.",
        githubUrl: "https://github.com/ilakkmanoharan",
        kaggleUrl: null,
        demoVideo: null,
        writeupLink: null,
        statusResult: "Finalist",
      },
    ],
  });

  await prisma.founderStudioItem.createMany({
    data: [
      {
        slug: "why-distributed-systems",
        title: "Why I care about distributed systems",
        category: "Engineering Experience",
        youtubeId: null,
        summary:
          "Short reflection on reliability, backpressure, and building systems that fail gracefully.",
        transcript:
          "Distributed systems force you to be honest about failure modes. I enjoy designing for partial failure, clear SLIs, and operability from day one.",
        relatedProjectSlug: "distributed-workflow-engine",
        relatedSkills: json(["Distributed Systems", "Backend Engineering"]),
      },
      {
        slug: "startup-idea-research-copilot",
        title: "Pitch: Research Copilot",
        category: "Startup Ideas",
        youtubeId: null,
        summary: "How I would validate the idea with three lighthouse users.",
        transcript:
          "Start with labs drowning in paper context. Ship a narrow ingestion + citation workflow before broader agent features.",
        relatedProjectSlug: "research-copilot",
        relatedSkills: json(["Scientific AI", "Startup Building"]),
      },
    ],
  });

  const backend = await prisma.skill.create({
    data: {
      slug: "backend-engineering",
      name: "Backend Engineering",
      category: "Backend Engineering",
      overview:
        "Designing scalable APIs, services, and data layers with strong correctness and observability.",
      yearsExperience: 5,
      tools: json(["Java", "Python", "Go", "Node.js", "Spring Boot", "FastAPI", "PostgreSQL", "Kafka", "Docker", "AWS"]),
      examples: json([
        "High-throughput ingestion services",
        "Idempotent workflow workers",
        "Schema evolution without downtime",
      ]),
      videoUrls: json([]),
      githubLinks: json(["https://github.com/ilakkmanoharan"]),
    },
  });

  await prisma.skillExperience.createMany({
    data: [
      {
        skillId: backend.id,
        organization: "Sample Org",
        role: "Software Engineer",
        summary: "Owned core billing and usage metering microservices.",
        startYear: 2021,
        endYear: 2024,
      },
    ],
  });

  await prisma.skill.createMany({
    data: [
      {
        slug: "full-stack-development",
        name: "Full Stack Development",
        category: "Full Stack Development",
        overview:
          "Shipping cohesive product experiences across Next.js/React, APIs, and databases.",
        yearsExperience: 5,
        tools: json(["TypeScript", "React", "Next.js", "Tailwind CSS", "PostgreSQL"]),
        examples: json(["Portfolio and dashboard products", "Auth-aware admin flows"]),
        videoUrls: json([]),
        githubLinks: json(["https://github.com/ilakkmanoharan"]),
      },
      {
        slug: "ai-ml-systems",
        name: "AI / ML Systems",
        category: "AI / ML Systems",
        overview:
          "ML lifecycle work: data quality, training, evaluation, deployment, and guardrails for production.",
        yearsExperience: 4,
        tools: json(["Python", "PyTorch", "Ray", "FastAPI", "vector DBs"]),
        examples: json(["Batch + online inference patterns", "Experiment tracking integrations"]),
        videoUrls: json([]),
        githubLinks: json(["https://github.com/ilakkmanoharan"]),
      },
    ],
  });
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
