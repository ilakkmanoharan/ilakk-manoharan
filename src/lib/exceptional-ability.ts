/**
 * Evidence of exceptional ability — edit here to update the public page.
 * Source notes: private/exceptional-ability/exp-ability-main.md (gitignored).
 * Evidence 2 (SciLayer preprints): src/lib/exceptional-ability-evidence2.ts
 * Evidence 3 (ASRA Phase 1): src/lib/exceptional-ability-evidence-phase1.ts
 * Evidence 4 (ASRA Phase 2): src/lib/exceptional-ability-evidence3.ts
 * Evidence 5 (ASRA Phase 3): src/lib/exceptional-ability-evidence4.ts
 * Evidence 6 (ASRA Phase 4): src/lib/exceptional-ability-evidence11.ts
 * Evidence 7–11 (ASRA Phases 5–9): src/lib/exceptional-ability-evidence-phase5.ts … phase9.ts
 * Evidence 12 (Portfolio & general-Agent1): src/lib/exceptional-ability-evidence5.ts
 * Evidence 16 (Orbit Wars): src/lib/exceptional-ability-evidence9.ts
 * Evidence 17 (Portfolio summary): src/lib/exceptional-ability-evidence10.ts
 * Evidence 18 (NFM & Atlas-GS): src/lib/exceptional-ability-evidence-nfm.ts
 */
import { scilayerScholarlyEvidenceSection } from "@/lib/exceptional-ability-evidence2";
import { asraPhase1EvidenceSection } from "@/lib/exceptional-ability-evidence-phase1";
import { asraPhase2EvidenceSection } from "@/lib/exceptional-ability-evidence3";
import { asraPhase3EvidenceSection } from "@/lib/exceptional-ability-evidence4";
import { asraPhase4EvidenceSection } from "@/lib/exceptional-ability-evidence11";
import { asraPhase5EvidenceSection } from "@/lib/exceptional-ability-evidence-phase5";
import { asraPhase6EvidenceSection } from "@/lib/exceptional-ability-evidence-phase6";
import { asraPhase7EvidenceSection } from "@/lib/exceptional-ability-evidence-phase7";
import { asraPhase8EvidenceSection } from "@/lib/exceptional-ability-evidence-phase8";
import { asraPhase9EvidenceSection } from "@/lib/exceptional-ability-evidence-phase9";
import { portfolioAgentArchitectureEvidenceSection } from "@/lib/exceptional-ability-evidence5";
import { orbitWarsEvidenceSection } from "@/lib/exceptional-ability-evidence9";
import { portfolioAgentEvidenceSection } from "@/lib/exceptional-ability-evidence10";
import { nfmAtlasGsEvidenceSection } from "@/lib/exceptional-ability-evidence-nfm";
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
      "ASRA is not a single competition hack—it is a nine-phase cognitive stack I designed, implemented, and deployed as versioned Kaggle agents (`asra-v0.1-phase1` through `asra-v1.0-phase9`). Each phase answers a distinct scientific question: experience → observation → navigation → causality → goals → planning → robustness → Decision Biology bridge → final integration.",
      "What makes ASRA exceptional as a research program: (1) action semantics are inferred from `(state, action, next_state)` transitions, not supplied by the environment; (2) every phase ships theory, open-source modules, eval evidence, and a competition notebook with full folder parity—Phase 1 now matches Phases 2–9 with dedicated `kaggle-notebooks/phaseN/` folders, kernel metadata, CLI submit tooling, and conceptual articles; (3) the same architecture transfers from ARC grid worlds to Decision Biology perturbation–response reasoning and the Nature Foundation Models program.",
      "Currently I'm building ASRA — an adaptive reasoning engine; Decision Biology — the first scientific domain built on top of it; and Nature Foundation Models — a broader scientific intelligence platform across biology, chemistry, physics, and environmental systems.",
    ],
    bullets: [
      "Nine-phase stack: Experience → Observation → Navigation → Causality → Goals → Planning → Robustness → Decision Biology → Integration",
      "All Kaggle notebooks: https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks",
      "SciLayer preprints (Phases 1–4 + program papers): https://sci-layer.vercel.app",
    ],
    links: withPortfolioLinks([
      {
        label: "ASRA on GitHub",
        href: "https://github.com/ilakkmanoharan/asra",
      },
      {
        label: "All ASRA Kaggle notebooks",
        href: "https://github.com/ilakkmanoharan/asra/tree/main/kaggle-notebooks",
      },
      {
        label: "SciLayer — ASRA corpus",
        href: "https://sci-layer.vercel.app",
      },
      {
        label: "Decision Biology",
        href: "https://decision-biology.vercel.app",
      },
      {
        label: "Nature Foundation Models (NFM)",
        href: "/nfm",
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
      "#ASRA",
    ],
  },
  scilayerScholarlyEvidenceSection,
  asraPhase1EvidenceSection,
  asraPhase2EvidenceSection,
  asraPhase3EvidenceSection,
  asraPhase4EvidenceSection,
  asraPhase5EvidenceSection,
  asraPhase6EvidenceSection,
  asraPhase7EvidenceSection,
  asraPhase8EvidenceSection,
  asraPhase9EvidenceSection,
  portfolioAgentArchitectureEvidenceSection,
  {
    number: 13,
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
    number: 14,
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
  {
    number: 15,
    title: "SciLayer — open science archive",
    paragraphs: [
      "SciLayer is an open scholarly archive I designed and built solo. Researchers sign in with ORCID, submit manuscripts from GitHub, and publish versioned preprints and articles with peer review, author profiles, and public discovery by search and taxonomy.",
      "It publishes my ASRA research corpus with persistent URLs and open licensing, and it matters as both a shipped product and scholarly infrastructure: Git stays the source of truth for manuscripts while the platform handles identity, validation, routing, and publication in one transparent workflow.",
    ],
    links: withPortfolioLinks([
      { label: "SciLayer", href: "https://sci-layer.vercel.app" },
      {
        label: "SciLayer on GitHub",
        href: "https://github.com/ilakkmanoharan/SciLayer",
      },
    ]),
    hashtags: ["#openscience", "#orcid", "#github", "#scilayer"],
  },
  orbitWarsEvidenceSection,
  portfolioAgentEvidenceSection,
  nfmAtlasGsEvidenceSection,
];
