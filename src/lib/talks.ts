import { siteConfig } from "@/lib/site";

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
  slidesUrl?: string;
};

export const talks: Talk[] = [
  {
    title: "Your next talk title",
    event: "Conference or meetup name",
    location: "City (optional)",
    date: "2026",
    format: "Keynote",
    description:
      "Short abstract—what the audience learned and why it mattered. Replace this entry in src/lib/talks.ts with your real sessions.",
    videoUrl: siteConfig.links.youtube,
  },
];
