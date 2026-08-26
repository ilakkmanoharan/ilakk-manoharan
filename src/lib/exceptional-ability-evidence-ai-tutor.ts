import type { ExceptionalAbilitySection } from "@/lib/exceptional-ability";

const portfolioNavLinks = [
  { label: "Projects", href: "/projects" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Startup catalog", href: "/startups" },
];

function withPortfolioLinks(links: { label: string; href: string }[]) {
  const seen = new Set(links.map((l) => l.href));
  return [...links, ...portfolioNavLinks.filter((l) => !seen.has(l.href))];
}

/** Evidence 29 — AI Tutor: live voice mentor learning product. */
export const aiTutorEvidenceSection: ExceptionalAbilitySection = {
  number: 29,
  title:
    "AI Tutor — live learning room with a voice AI mentor (not another chat window)",
  paragraphs: [
    "AI Tutor is an EdTech product I am building end-to-end: a live learning room with Agentic Owl where learners speak, draw on a shared whiteboard, and practice turn-by-turn—Learn, Interview, or Rapid fire modes—instead of pasting questions into a chatbot that dumps answers.",
    "The first live course is Software Engineering Interview Prep (coding, system design, behavioral). The same mentor room is designed to host more courses over time; additional subjects appear on the site as coming soon while the SE prep course is open today.",
    "Why this supports exceptional ability: Demonstrates original product vision and shipping discipline—voice-first mentoring, collaborative whiteboard practice, and a multi-course platform architecture—from idea to a public, usable product at ai-tutor-lyart-zeta.vercel.app, with portfolio and startup-catalog integration.",
  ],
  bullets: [
    "Live product: https://ai-tutor-lyart-zeta.vercel.app",
    "First course: Software Engineering Interview Prep — coding · system design · behavioral",
    "Modes: Learn, Interview, Rapid fire — voice + shared whiteboard",
    "Platform thesis: one mentor room → many courses",
  ],
  links: withPortfolioLinks([
    {
      label: "AI Tutor (live product)",
      href: "https://ai-tutor-lyart-zeta.vercel.app",
    },
    { label: "Startup catalog — AI Tutor", href: "/startups" },
  ]),
  hashtags: [
    "#AITutor",
    "#EdTech",
    "#VoiceAI",
    "#InterviewPrep",
    "#BuildInPublic",
  ],
};
