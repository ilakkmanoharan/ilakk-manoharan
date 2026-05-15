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
