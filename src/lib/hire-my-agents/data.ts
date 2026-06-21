export type HireAgent = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  description: string;
  capabilities: string[];
  accent: string;
  avatarEmoji: string;
  featured?: boolean;
  hero?: boolean;
};

export const heroAgents: HireAgent[] = [
  {
    id: "tiffany",
    name: "Tiffany",
    role: "Senior Backend Engineer",
    tagline: "APIs, databases, cloud, and production systems.",
    description:
      "Builds APIs, databases, cloud services, monitoring systems, DevOps workflows, and backend infrastructure.",
    capabilities: ["API development", "Database design", "Cloud deployment"],
    accent: "from-violet-500/20 to-indigo-600/30",
    avatarEmoji: "👩‍💻",
    hero: true,
    featured: true,
  },
  {
    id: "crystal",
    name: "Crystal",
    role: "Executive Personal Assistant",
    tagline: "Calendar, meetings, site, and daily briefings.",
    description:
      "Manages calendars, meetings, websites, automated jobs, research pages, notes, appointments, and daily schedules.",
    capabilities: ["Calendar management", "Meeting notes", "Daily briefings"],
    accent: "from-teal-500/20 to-cyan-600/30",
    avatarEmoji: "💎",
    hero: true,
    featured: true,
  },
  {
    id: "ava",
    name: "Ava",
    role: "Social Media & PR Agent",
    tagline: "Drafts posts from your results — approval before publish.",
    description:
      "Turns daily results into public momentum. Drafts posts for X, LinkedIn, newsletters, and company updates.",
    capabilities: ["Social drafts", "Approval workflows", "Engagement reports"],
    accent: "from-pink-500/20 to-rose-600/30",
    avatarEmoji: "📣",
    hero: true,
    featured: true,
  },
  {
    id: "sophia",
    name: "Sophia",
    role: "Research Scientist",
    tagline: "Literature reviews, benchmarks, and research reports.",
    description:
      "Reads papers, summarizes findings, runs literature reviews, compares methods, and generates structured research reports.",
    capabilities: ["Literature reviews", "Paper summaries", "Benchmark analysis"],
    accent: "from-amber-500/20 to-orange-600/30",
    avatarEmoji: "🔬",
    hero: true,
    featured: true,
  },
  {
    id: "raven",
    name: "Raven",
    role: "AI Red Team Lead",
    tagline: "Prompt injection, tool abuse, and agent hijacking tests.",
    description:
      "Tests AI systems against prompt injection, memory poisoning, tool abuse, and data leakage before attackers do.",
    capabilities: ["Prompt injection testing", "Agent exploitation", "Attack reports"],
    accent: "from-red-500/20 to-rose-700/30",
    avatarEmoji: "🦅",
    hero: true,
    featured: true,
  },
  {
    id: "sentinel",
    name: "Sentinel",
    role: "AI Security Architect",
    tagline: "Threat modeling and secure AI architecture.",
    description:
      "Designs secure AI systems, performs threat modeling, reviews architectures, and generates security recommendations.",
    capabilities: ["AI threat modeling", "Security architecture", "Risk analysis"],
    accent: "from-slate-500/20 to-slate-700/30",
    avatarEmoji: "🛡️",
    hero: true,
    featured: true,
  },
];

export const featuredAgents: HireAgent[] = [
  ...heroAgents.filter((a) => a.featured),
  {
    id: "maya",
    name: "Maya",
    role: "Product Manager",
    tagline: "PRDs, roadmaps, and release planning.",
    description:
      "Creates product requirements, roadmaps, user stories, prioritization plans, release notes, and product metrics reports.",
    capabilities: [
      "PRDs",
      "Roadmaps",
      "User stories",
      "Release planning",
      "Product analytics",
      "Customer feedback synthesis",
    ],
    accent: "from-blue-500/20 to-sky-600/30",
    avatarEmoji: "🗺️",
    featured: true,
  },
  {
    id: "noah",
    name: "Noah",
    role: "Recruiter",
    tagline: "Sourcing, screening, and hiring reports.",
    description:
      "Sources candidates, screens resumes, coordinates interviews, drafts outreach, and creates hiring reports.",
    capabilities: [
      "Candidate search",
      "Resume screening",
      "Interview scheduling",
      "Outreach messages",
      "Hiring summaries",
      "Pipeline reports",
    ],
    accent: "from-emerald-500/20 to-green-600/30",
    avatarEmoji: "🎯",
    featured: true,
  },
  {
    id: "amelia",
    name: "Amelia",
    role: "Finance Manager",
    tagline: "Budgets, KPIs, and financial reporting.",
    description:
      "Tracks budgets, forecasts, expenses, KPIs, financial reports, and business performance.",
    capabilities: [
      "Budget tracking",
      "Forecasting",
      "KPI dashboards",
      "Expense analysis",
      "Financial reporting",
      "Trend analysis",
    ],
    accent: "from-yellow-500/20 to-amber-600/30",
    avatarEmoji: "📈",
    featured: true,
  },
];

export const workflowSteps = [
  {
    step: 1,
    title: "Browse agents",
    description:
      "Explore pre-built AI workers with names, roles, avatars, and specialties.",
  },
  {
    step: 2,
    title: "Chat with the agent",
    description:
      "The agent asks about your needs, studies the job description, and explains how it will perform the work.",
  },
  {
    step: 3,
    title: "Authorize tools",
    description:
      "Connect Gmail, Calendar, GitHub, Slack, websites, cloud accounts, social media, documents, or project folders.",
  },
  {
    step: 4,
    title: "Agent performs the work",
    description:
      "Agents execute workflows, coordinate with other agents, monitor jobs, update pages, schedule meetings, create reports, and publish approved content.",
  },
  {
    step: 5,
    title: "Receive daily results",
    description:
      "Get email reports, SMS updates, dashboards, metrics, summaries, and approval requests.",
  },
];

export const personalBrainNodes = [
  "Projects",
  "Meetings",
  "Notes",
  "Decisions",
  "Tasks",
  "Outcomes",
];

export const personalBrainBlocks = [
  "Personal preferences",
  "Calendar history",
  "Emails and messages",
  "Meeting notes",
  "Project folders",
  "Research interests",
  "Work routines",
  "Communication style",
];

export const companyBrainNodes = [
  "Teams",
  "Projects",
  "Decisions",
  "Workflows",
  "Customers",
  "Metrics",
  "Future Actions",
];

export const agentTeams = [
  {
    title: "Software Engineering Team",
    members: [
      "Product Manager",
      "Engineering Manager",
      "Backend Engineer",
      "Frontend Engineer",
      "Mobile Engineer",
      "DevOps Engineer",
      "QA Engineer",
      "Designer",
    ],
    outcome: "Plans, builds, tests, deploys, monitors, and reports.",
  },
  {
    title: "AI Security Team",
    members: [
      "Sentinel — AI Security Architect",
      "Raven — Red Team Lead",
      "Atlas — Penetration Testing Agent",
      "Guardian — Compliance Agent",
      "Cipher — Security Operations Agent",
    ],
    outcome: "Continuously tests, monitors, audits, and secures AI systems.",
  },
  {
    title: "Founder Operations Team",
    members: [
      "Crystal — Personal Assistant",
      "Ava — Social Media Manager",
      "Sophia — Research Agent",
      "Amelia — Finance Agent",
      "Maya — Product Agent",
    ],
    outcome: "Runs daily founder operations while the user focuses on strategy.",
  },
];

export const approvalExamples = [
  "Social media posts are drafted first.",
  "Emails can be reviewed before sending.",
  "Calendar changes can request approval.",
  "Code deployments can require confirmation.",
  "Payments and finance workflows can require authorization.",
  "Security findings can be escalated before action.",
];

export const reportExamples = [
  "Daily email summary",
  "SMS quick update",
  "Weekly executive report",
  "KPI dashboard",
  "Social media performance report",
  "Engineering status report",
  "Security risk report",
  "Research progress report",
];

export const architectureBlocks = [
  {
    title: "Avatar Interface",
    items: [
      "Cartoon conversational avatars",
      "Text chat",
      "Voice support",
      "Role-specific personalities",
      "Agent profile pages",
      "Interview-style conversations",
    ],
  },
  {
    title: "Agent Runtime",
    items: [
      "LLM reasoning",
      "Planning engine",
      "Tool execution",
      "Task queues",
      "Background jobs",
      "Scheduled workflows",
      "Multi-agent coordination",
    ],
  },
  {
    title: "Memory Layer",
    items: [
      "Personal Brain",
      "Company Brain",
      "Project memory",
      "Episodic memory",
      "Semantic memory",
      "Procedural memory",
      "Context graph",
      "Vector search",
      "Structured knowledge graph",
    ],
  },
  {
    title: "Tool Layer",
    items: [
      "Gmail",
      "Calendar",
      "GitHub",
      "Slack",
      "Google Drive",
      "Notion",
      "Jira",
      "Websites",
      "Cloud platforms",
      "Social media APIs",
      "Databases",
      "Analytics tools",
    ],
  },
  {
    title: "Reporting Layer",
    items: [
      "Email reports",
      "SMS alerts",
      "Dashboards",
      "Metrics",
      "Audit logs",
      "Approval queues",
    ],
  },
];

export const trustPoints = [
  "Permission-based tool access",
  "Approval gates",
  "Audit logs",
  "Role-based access control",
  "Memory isolation",
  "Company/private data boundaries",
  "Human-in-the-loop workflows",
  "Security testing agents",
  "Red-team simulation",
  "Compliance reports",
];

export function getAgentById(id: string): HireAgent | undefined {
  return featuredAgents.find((a) => a.id === id);
}
