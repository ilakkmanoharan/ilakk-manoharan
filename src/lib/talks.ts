/**
 * Conference talks, meetups, and invited sessions.
 * Edit this list to update the Talks page (no database required).
 */
export type Talk = {
  title: string;
  event: string;
  location?: string;
  date: string;
  format: string;
  description: string;
  videoUrl?: string;
  audioUrl?: string;
  relatedAudioUrl?: string;
  relatedAudioLabel?: string;
  slidesUrl?: string;
  websiteUrl?: string;
};

export const talks: Talk[] = [
  {
    title: "Hire My Agents: AI Workers with Jobs, Reports, and Accountability",
    event: "Naperville AI Enthusiasts meetup",
    location: "NIU Naperville, 1120 E Diehl Rd, Room 119 · Jun 22, 2026 · 6:00 PM",
    date: "2026",
    format: "Meetup",
    description:
      "Opening slot at the Naperville AI Enthusiasts meetup — an introduction to Hire My Agents, an AI workforce platform where you hire specialized agents for real work: assistance, engineering, recruiting, research, and more. I cover why most agents fail beyond short demos, what makes these workers different (memory, workflows, tools, approval gates, and daily reporting), and how I'm training the first generation of agents with jobs, reports, and accountability. Learn more: https://ilakk-manoharan.vercel.app/hire-my-agents",
    websiteUrl: "/hire-my-agents",
    videoUrl: "/talks/naperville-ai-meetup-2026/recording.mp4",
    audioUrl: "/talks/naperville-ai-meetup-2026/talk10.m4a",
    relatedAudioUrl: "/talks/naperville-ai-meetup-2026/context-as-a-data-layer.m4a",
    relatedAudioLabel: "Context as a data layer",
  },
  {
    title: "Quantum Dot Spin Qubits for Quantum Computing",
    event: "ISSRDC 2023",
    location: "Innovation Solutions Technical Session · Aug 2",
    date: "2023",
    format: "Presentation",
    description:
      "Technical session on quantum-dot spin qubits as a path toward scalable quantum computing, presented at the International Space Station Research and Development Conference.",
    videoUrl: "https://www.youtube.com/watch?v=5RBXYNTZ_Y8",
  },
  {
    title:
      "Exploring Alternative Materials and Methods for Synthesizing Quantum Dots",
    event: "ISSRDC 2023",
    location: "Aug 3",
    date: "2023",
    format: "Presentation",
    description:
      "Presentation on synthesis routes and material choices for quantum dots, in the context of quantum information and sensing applications.",
    videoUrl: "https://www.youtube.com/watch?v=g91iMmAEupI",
  },
];
