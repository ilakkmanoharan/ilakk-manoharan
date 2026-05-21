/**
 * Evidence of exceptional ability — edit here to update the public page.
 * Source notes: private/etc/exceptional-ability.md (gitignored).
 */
export type ExceptionalAbilityLink = {
  label: string;
  href: string;
};

export type AppStoreScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type ExceptionalAbilitySection = {
  number: number;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  links?: ExceptionalAbilityLink[];
  hashtags?: string[];
  appStoreScreenshots?: AppStoreScreenshot[];
};

export const exceptionalAbilityIntro =
  "Selected evidence of exceptional ability in software engineering, scientific AI, invention, and end-to-end product execution.";

/** Included at the end of every evidence section’s link row. */
export const portfolioNavLinks: ExceptionalAbilityLink[] = [
  { label: "Projects", href: "/projects" },
  { label: "Hackathons", href: "/hackathons" },
  { label: "Startup catalog", href: "/startups" },
];

function withPortfolioLinks(links: ExceptionalAbilityLink[]): ExceptionalAbilityLink[] {
  const seen = new Set(links.map((l) => l.href));
  return [
    ...links,
    ...portfolioNavLinks.filter((l) => !seen.has(l.href)),
  ];
}

export const exceptionalAbilitySections: ExceptionalAbilitySection[] = [
  {
    number: 1,
    title: "Adaptive scientific reasoning — ARC Prize 2026 & Decision Biology",
    paragraphs: [
      "Recently, I started working on the Kaggle Competition ARC Prize 2026 — ARC-AGI-3, and immediately wanted to apply world models to Decision Biology and Nature Foundation Models too.",
      "The idea of agents exploring unfamiliar environments, inferring hidden mechanics, learning action semantics, and building adaptive reasoning systems felt directly connected to biological systems and cellular decision-making.",
      "So far, a lot of computational biology has mainly focused on prediction, classification, statistical modeling, sequence analysis, and narrow ML applications on biological datasets. But biological systems are adaptive, dynamic, uncertain, and continuously interacting with their environments.",
      "What became very exciting to me is the possibility of using world models, adaptive reasoning, hidden-state inference, and exploration-driven learning to model how cells process information, respond to perturbations, adapt, and make decisions under uncertainty.",
      "Currently I'm building ASRA — an adaptive reasoning engine; Decision Biology — the first scientific domain built on top of it; and Nature Foundation Models — a broader scientific intelligence platform across biology, chemistry, physics, and environmental systems.",
    ],
    links: withPortfolioLinks([
      {
        label: "ASRA on GitHub",
        href: "https://github.com/ilakkmanoharan/asra",
      },
      {
        label: "ARC Prize 2026 — ARC-AGI-3",
        href: "https://www.kaggle.com/competitions/arc-prize-2026-arc-agi-3",
      },
    ]),
    hashtags: [
      "#fluidintelligence",
      "#decisionbiology",
      "#ARCPrize2026",
    ],
  },
  {
    number: 2,
    title: "Patent, federal R&D proposals, ISSRDC, and shipped products",
    paragraphs: [
      "I have filed a U.S. patent application for Smart Restaurant Powered by Cloud-Native IoT AIOS (Publication No. US 2024/0273653 A1, published August 15, 2024). The application describes a fully automated AI-driven smart restaurant ecosystem integrating cloud-native IoT infrastructure, intelligent kitchen orchestration, contactless food preparation, automated ordering and vending, inventory optimization, and real-time operational analytics.",
      "In addition, I developed multiple advanced scientific and engineering research proposals submitted to NASA SBIR, NSF SBIR/STTR, and ISS National Lab programs (2023–2024), covering areas such as quantum dots, spin qubits, spintronics, Physics-Informed Neural Networks (PINNs), computational fluid dynamics, quantum material synthesis, microgravity manufacturing, and AI-driven scientific modeling for aerospace and biomedical applications.",
    ],
    bullets: [
      "Quantum Dot Spin Qubits for Quantum Computing — ISSRDC 2023, Innovation Solutions Technical Session (Aug 2, 2023)",
      "Exploring Alternative Materials and Methods for Synthesizing Quantum Dots — ISSRDC 2023 (Aug 3, 2023)",
    ],
    links: withPortfolioLinks([
      {
        label: "U.S. patent US 2024/0273653 A1",
        href: "https://patents.google.com/patent/US20240273653A1/en",
      },
      {
        label: "Federal grants proposals (Medium)",
        href: "https://medium.com/@ilakk2023/my-federal-grants-proposals-to-nasa-sbir-nsf-project-pitch-and-iss-nlra-2023-2024-5f19827d5109",
      },
      {
        label: "ISSRDC 2023 — spin qubits talk",
        href: "https://www.youtube.com/watch?v=5RBXYNTZ_Y8",
      },
      {
        label: "ISSRDC 2023 — quantum dots synthesis talk",
        href: "https://www.youtube.com/watch?v=g91iMmAEupI",
      },
      {
        label: "Talks",
        href: "/talks",
      },
    ]),
  },
  {
    number: 3,
    title: "Full-stack product execution — web and App Store",
    paragraphs: [
      "Demonstrated strong execution ability and work ethic by independently conceptualizing, architecting, designing, and implementing full-stack software products end-to-end across mobile, backend, infrastructure, and product layers. Recent examples include a magazine-style publishing platform and a productivity application for organizing and retrieving information using intelligent tagging workflows.",
      "Published multiple iOS apps on the App Store under my developer account—including productivity, social, lifestyle, and education titles—alongside shipped web products.",
    ],
    bullets: [
      "TagScribe — productivity / smart bookmarking",
      "Socically — social networking",
      "Poll Hippo — lifestyle",
      "nerding app, Sequenched, QuizzlyMath5-WholeNumbers — education",
    ],
    links: withPortfolioLinks([
      {
        label: "Publish Desk",
        href: "https://publish-desk.com/",
      },
      {
        label: "Tag Scribe (App Store)",
        href: "https://apps.apple.com/us/app/tagscribe/id6760214615",
      },
    ]),
    appStoreScreenshots: [
      {
        src: "/images/app-store/developer-apps-productivity.png",
        alt: "App Store developer page listing TagScribe, Socically, and Poll Hippo",
        caption:
          "App Store — productivity, social, and lifestyle apps (TagScribe, Socically, Poll Hippo)",
      },
      {
        src: "/images/app-store/developer-apps-education.png",
        alt: "App Store developer page listing nerding app, Sequenched, and QuizzlyMath5-WholeNumbers",
        caption:
          "App Store — education apps (nerding app, Sequenched, QuizzlyMath5-WholeNumbers)",
      },
    ],
  },
];
