import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "TOMO and Local Intelligence";
const path = "/projects/tomo/local-intelligence";
const description = "How TOMO and garden nodes turn observations into decisions and share responsibility across garden patches.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, images: ["/tomo/plant-inspection.webp"] },
};

const decisionTerms = [
  {
    term: "Local inference",
    definition: "Running an AI model on the robot or garden node to turn inputs into predictions—for example, identifying potentially wilted tomato leaves from a photo.",
  },
  {
    term: "Local intelligence",
    definition: "Combining observations with local context, memory, reasoning, goals, rules, planning, and historical data to decide what to do.",
  },
];

const responsibilityTerms = [
  {
    term: "Spatial intelligence",
    definition: "Each node understands a defined physical area—a square garden patch—including plant locations, boundaries, robot positions, and spatial relationships. The square defines its area of responsibility.",
  },
  {
    term: "Garden node",
    definition: "The “brain on the ground” maintains plant identities, histories, maps, schedules, task priorities, goals, and permissions. It owns the local what and when.",
  },
  {
    term: "Robot intelligence",
    definition: "TOMO handles movement, immediate perception, navigation, obstacle avoidance, safe execution, and tactical adjustments. It owns the how, within authorized limits.",
  },
];

const hardwareTerms = [
  {
    term: "Node hardware",
    definition: "A complete small computer needs a CPU, RAM, storage, connectivity, power, cooling, and an enclosure, with an optional GPU or AI accelerator. A GPU alone is not a complete node.",
  },
  {
    term: "Flexible computing",
    definition: "Hardware can range from a microcontroller for simple sensing and rules to a Jetson-style computer or server for richer workloads. A Jetson integrates CPU and GPU with shared memory. Not every node needs a GPU; nearby nodes can share an accelerator.",
  },
];

const loop = ["Observe", "Remember", "Interpret", "Decide", "Act", "Check the outcome"];

function Definitions({ entries }: { entries: { term: string; definition: string }[] }) {
  return (
    <dl className="my-6 space-y-5">
      {entries.map(({ term, definition }) => (
        <div key={term}>
          <dt className="font-semibold">{term}</dt>
          <dd className="mt-1 text-muted-foreground">{definition}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function TomoLocalIntelligencePage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <Link href="/projects/tomo" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Back to TOMO
      </Link>
      <header className="mt-8 overflow-hidden rounded-3xl border border-emerald-950/15 bg-[#f5f4ec] text-[#163b32]">
        <div className="p-6 md:p-10">
          <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed md:text-xl">{description}</p>
        </div>
        <Image
          src="/tomo/plant-inspection.webp"
          alt="TOMO examining tomato leaves beside a soil moisture probe and a garden node"
          width={1536}
          height={1024}
          sizes="(max-width: 1152px) 100vw, 1152px"
          preload
          className="h-auto w-full"
        />
      </header>

      <div className="mx-auto max-w-3xl leading-relaxed md:text-lg">
        <section className="py-10 md:py-14">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">From inference to decisions</h2>
          <Definitions entries={decisionTerms} />
          <p className="rounded-2xl border bg-card p-6">
            <strong>Contextual decisions.</strong> For plant T‑023, the node considers soil moisture, watering history, temperature, and previous outcomes before deciding: “Hold watering, inspect again this evening, and alert the owner if symptoms persist.”
          </p>
          <h3 className="mt-8 font-heading text-2xl font-semibold">Intelligence loop</h3>
          <ol className="my-4 flex flex-wrap items-center gap-x-2 gap-y-2 text-base" role="list">
            {loop.map((step, index) => (
              <li key={step} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true" className="text-muted-foreground">→</span>}
                <span className="rounded-full border bg-card px-3 py-1">{step}</span>
              </li>
            ))}
          </ol>
          <p>Inference supports this loop; a prediction alone does not establish a cause or justify an action.</p>
          <p className="mt-5"><strong>Architectural responsibility.</strong> Local inference describes model execution; local intelligence describes contextual decision making. Neither automatically guarantees learning or independence from cloud services—those require explicit design choices.</p>
        </section>

        <section className="border-t py-10 md:py-14">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">What the garden knows and what TOMO does</h2>
          <Definitions entries={responsibilityTerms} />
          <h3 className="mt-8 font-heading text-2xl font-semibold">Garden node hardware</h3>
          <Definitions entries={hardwareTerms} />
        </section>
      </div>

      <section className="border-t py-10 md:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">Decoupled spatial intelligence</h2>
        </div>
        <Image
          src="/tomo/patch-handoff.webp"
          alt="TOMO crossing a gravel lane between two square garden patches, each with its own node"
          width={1672}
          height={941}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="mt-6 h-auto w-full rounded-3xl border"
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 leading-relaxed md:text-lg">
          <p>
            <strong>Decoupled spatial intelligence</strong> means the garden node maintains a model of the place that can outlast any individual robot. It keeps the map, plant identities, observation history, and task priorities for its patch. TOMO uses that context to carry out tasks while handling immediate perception, navigation, and safe movement on board. A node can also use observations from fixed sensors between robot visits, and a replacement robot can use the same garden context without rebuilding it.
          </p>
          <p>
            When TOMO moves into a neighboring patch, it can request that node’s map, task brief, and permissions. The receiving node remains responsible for decisions in its area, while TOMO retains control of its immediate movement. This is how the <strong>Planetary Nervous System</strong> connects local intelligence across physical spaces while preserving each node’s responsibility for the place it knows.
          </p>
          <p>
            <strong>Distributed Architecture.</strong> Nodes manage their own areas while coordinating with neighboring nodes. This connects TOMO’s garden-scale system to the broader Planetary Nervous System vision.
          </p>
          <blockquote className="rounded-2xl bg-[#f5f4ec] p-6 font-heading text-xl leading-relaxed text-[#163b32] md:p-8 md:text-2xl">
            “Local inference helps TOMO interpret what it senses. Local intelligence uses that interpretation, the garden’s history, and its goals to decide what should happen next.”
          </blockquote>
          <Link href="/projects/tomo/planetary-nervous-system" className="inline-block font-medium underline underline-offset-4">
            Read TOMO and the Planetary Nervous System
          </Link>
        </div>
      </section>
    </article>
  );
}
