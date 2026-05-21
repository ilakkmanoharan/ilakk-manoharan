export const siteConfig = {
  name: "Ilakkuvaselvi (Ilak) Manoharan",
  shortName: "Ilak Manoharan",
  title: "Ilak Manoharan — Engineer, Founder, AI Systems Builder",
  description:
    "Software engineer, AI systems builder, and founder at the intersection of distributed systems, full-stack engineering, scientific AI, and product innovation.",
  heroGreeting:
    "Hi, I’m Ilakkuvaselvi (Ilak) Manoharan — a software engineer, AI systems builder, and founder building at the intersection of distributed systems, full-stack engineering, scientific AI, and product innovation.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  calEmbedUrl: process.env.NEXT_PUBLIC_CAL_EMBED_URL ?? "",
  introVideoId: process.env.NEXT_PUBLIC_INTRO_VIDEO_ID ?? "",
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "",
  links: {
    linkedin: "https://linkedin.com/in/ilakkmanoharan",
    github: "https://github.com/ilakkmanoharan",
    youtube: "https://www.youtube.com/@ilakkmanoharan3011",
    medium: "https://medium.com/@ilakk2023",
    x: "https://x.com/ilakkManoharan",
  },
  /** Federal R&D proposal narrative (Medium); linked from Projects page. */
  federalGrantProposalsArticle: {
    url: "https://medium.com/@ilakk2023/my-federal-grants-proposals-to-nasa-sbir-nsf-project-pitch-and-iss-nlra-2023-2024-5f19827d5109",
    title:
      "My federal grants proposals to NASA SBIR, NSF Project Pitch, and ISS NLRA (2023–2024)",
  },
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/startups", label: "Startup Catalog" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/founder-studio", label: "Founder Studio" },
  { href: "/talks", label: "Talks" },
  { href: "/skills", label: "Skills" },
  { href: "/recruiter", label: "Recruiter Portal" },
  { href: "/exceptional-ability", label: "Exceptional Ability" },
  { href: "/schedule", label: "Schedule" },
  { href: "/contact", label: "Contact" },
] as const;
