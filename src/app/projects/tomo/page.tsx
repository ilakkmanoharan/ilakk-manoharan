import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, FileText, Sprout } from "lucide-react";
import { ViewTracker } from "@/components/view-tracker";
import manuscript from "../../../../public/tomo/paper.json";

const PAPER = "https://zenodo.org/records/23873426";
const IMAGE_POST = "https://x.com/ilakkManoharan/status/2117256931920257499";
const VISION_POST = "https://x.com/ilakkManoharan/status/2116951780634624098";
const PDF = "/tomo/world-as-graph-database-preprint.pdf";

export const metadata: Metadata = {
  title: "TOMO — Shared Knowledge for Robots",
  description: "A federated world graph for distributed robotic intelligence. Explore TOMO’s tomato-monitoring concept, the open-access paper, and the research agenda.",
  alternates: { canonical: "/projects/tomo" },
  openGraph: {
    title: "TOMO — Shared Knowledge for Robots",
    description: "Local autonomy. Shared evidence. Coordinated action. A research concept starting in the tomato greenhouse.",
    url: "/projects/tomo",
    images: [{ url: "/tomo/greenhouse-concept.webp", width: 1672, height: 941, alt: "TOMO agricultural robotics concept illustration" }],
  },
  twitter: { card: "summary_large_image", title: "TOMO — Shared Knowledge for Robots", description: "A federated world graph, starting with tomato monitoring.", images: ["/tomo/greenhouse-concept.webp"] },
};

const architecture = [
  ["01", "Robots keep local control", "Perception, motion, obstacle response, and emergency behavior stay onboard. A task cache defines which actions may continue during disconnection."],
  ["02", "Gateways serve local evidence", "A regional gateway authenticates requests, receives observations, and returns task-relevant views. A compatible charging dock may share the same location."],
  ["03", "Graphs connect across regions", "Operators maintain their own partitions and exchange authorized summaries through agreed schemas. Large images, geometry, and telemetry can stay in specialized stores."],
];
const evidence = [
  ["Observation", "What was measured", "A soil moisture reading or a plant image, with source, location, units, time, and uncertainty."],
  ["Inference", "What it might mean", "A watering recommendation or disease label, linked to supporting evidence and the model or policy version."],
  ["Assignment", "Who may act", "A valid task assignment or resource reservation, enforced separately from historical graph replication."],
  ["Verified action", "What actually happened", "A completion record supported by actuator feedback or another defined verification mechanism."],
];
const workflow = [
  ["Observe", "Robot one records a soil measurement and plant image. The graph links this evidence to a plant, bed, and soil zone."],
  ["Interpret", "A service proposes an inspection or watering task under a policy defining acceptable evidence age and confidence."],
  ["Coordinate", "Robot two checks capability, battery reserve, evidence freshness, and ownership before accepting the task."],
  ["Act & verify", "If authorized, it waters and records commanded volume separately from verified delivery, then schedules a follow-up measurement."],
];
const failures = [
  ["Stale or contradictory evidence", "Remeasure or request review. A newer timestamp alone does not establish which sensor is correct."],
  ["Unavailable charger", "Revise the route while preserving the configured battery reserve and checking reachable alternatives."],
  ["Connection lost before ownership", "Defer the shared action. Continue only work allowed by the cached task contract."],
];
const comparisons = ["Independent robots", "Conventional message sharing / common database", "Centralized graph service", "Proposed federated graph"];

function SourceLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-medium underline decoration-current/30 underline-offset-4 hover:decoration-current">{children}<ArrowUpRight className="size-4 shrink-0" aria-hidden="true" /></a>;
}

export default function TomoProjectPage() {
  return (
    <>
      <ViewTracker path="/projects/tomo" resourceType="project" resourceSlug="tomo" />
      <article className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <Link href="/startups" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" />Startup Catalog</Link>
        <header className="mt-8 overflow-hidden rounded-3xl border border-emerald-950/15 bg-[#f5f4ec] text-[#163b32]">
          <div className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em]"><Sprout className="size-4" aria-hidden="true" />Robotics · Shared intelligence</p>
              <h1 className="mt-5 font-heading text-6xl font-semibold tracking-tight md:text-8xl">TOMO</h1>
              <p className="mt-4 max-w-xl font-heading text-3xl leading-tight md:text-4xl">What if robots shared<br className="hidden md:block" /> what they know?</p>
              <p className="mt-5 max-w-xl leading-relaxed text-[#4b6258]">A federated world graph that connects local robotic intelligence with shared, traceable evidence. Starting with a bounded tomato-growing environment.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={PAPER} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#163b32] px-5 py-3 text-sm font-medium text-white hover:bg-[#245c4e]">Read the paper<ArrowUpRight className="size-4" aria-hidden="true" /></a>
                <a href="#scenario" className="rounded-full border border-[#163b32]/30 px-5 py-3 text-sm font-medium hover:bg-white/60">Explore the concept</a>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-950/15 bg-white/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#60756b]">Research snapshot</p>
              <dl className="mt-5 space-y-5 text-sm">
                <div><dt className="text-[#60756b]">Stage</dt><dd className="mt-1 font-medium">Concept / Perspective preprint</dd></div>
                <div><dt className="text-[#60756b]">First scenario</dt><dd className="mt-1 font-medium">Two robots, tomato beds, soil sensors, one gateway</dd></div>
                <div><dt className="text-[#60756b]">Core question</dt><dd className="mt-1 font-medium">Can shared evidence reduce total energy per verified successful task?</dd></div>
                <div><dt className="text-[#60756b]">Author · Published</dt><dd className="mt-1 font-medium">Ilakkuvaselvi Manoharan · November 1, 2026</dd></div>
              </dl>
            </div>
          </div>
          <figure>
            <Image src="/tomo/greenhouse-concept.webp" alt="Concept illustration of two compact robots monitoring tomatoes with shared sensing and a gateway beside a charging dock" width={1672} height={941} sizes="(max-width: 1152px) 100vw, 1152px" preload className="h-auto w-full" />
            <figcaption className="px-6 py-3 text-xs text-[#4b6258] md:px-10">New AI-generated concept illustration for TOMO. The deployment is hypothetical.</figcaption>
          </figure>
        </header>

        <nav aria-label="TOMO page sections" className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-b pb-6 text-sm text-muted-foreground">
          {[["idea", "The idea"], ["architecture", "Architecture"], ["scenario", "TOMO scenario"], ["evaluation", "Evaluation"], ["visuals", "Original posts & visuals"], ["paper", "Full paper"]].map(([id, label]) => <a key={id} href={`#${id}`} className="hover:text-foreground hover:underline">{label}</a>)}
        </nav>

        <section id="idea" className="scroll-mt-24 py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">01 / The idea</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">Measure once. Make knowledge useful again.</h2>
          <div className="mt-6 grid gap-6 leading-relaxed text-muted-foreground md:grid-cols-2">
            <p>A robot may inspect a plant, measure a patch of soil, or discover that a route is blocked. Another robot may soon need that same information. TOMO asks how they could reuse evidence without repeating every observation — and without treating old or uncertain information as fact.</p>
            <p>The paper proposes an evolving graph of task-relevant entities and relationships. Plants, soil zones, paths, tools, robots, chargers, and tasks are connected to their supporting observations. Each robot retrieves a bounded, authorized view while retaining immediate control onboard.</p>
          </div>
          <aside className="mt-7 rounded-2xl border border-emerald-900/15 bg-emerald-900/5 p-5 text-sm leading-relaxed"><strong>Current status:</strong> TOMO is an illustrative research design. The preprint reports no implementation, experiments, or demonstrated energy savings. Its graph represents partial observations with provenance; its benefits are hypotheses to test.</aside>
        </section>

        <section id="architecture" className="scroll-mt-24 border-t py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">02 / Architecture</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">Local autonomy. Shared evidence.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">{architecture.map(([n, title, body]) => <div key={n} className="rounded-2xl border bg-card p-6"><span className="font-mono text-sm text-emerald-700">{n}</span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}</div>
          <figure className="mt-8 overflow-hidden rounded-2xl border bg-[#f5f4ec]">
            <Image src="/tomo/architecture-concept.webp" alt="Isometric TOMO concept connecting physical tomato beds, two robots, soil sensors, and a charging gateway to shared graph entities" width={1672} height={941} sizes="(max-width: 1152px) 100vw, 1152px" className="h-auto w-full" />
            <figcaption className="px-5 py-3 text-xs text-muted-foreground">New AI-generated architecture illustration. Connections depict proposed evidence sharing.</figcaption>
          </figure>
          <h3 className="mt-10 font-heading text-2xl font-semibold">A clear contract between evidence and action</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">{evidence.map(([kind, title, body]) => <div key={kind} className="rounded-xl border p-5"><p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">{kind}</p><h4 className="mt-2 font-semibold">{title}</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}</div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Stable identifiers, coordinate transforms, units, schema versions, and explicit uncertainty make exchange meaningful. Provenance makes an assertion traceable; it does not prove correctness. A graph supports retrieval and coordination, while prediction, optimization, and control require their own models and algorithms.</p>
        </section>

        <section id="scenario" className="scroll-mt-24 border-t py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">03 / The TOMO scenario</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">Start with a tomato-growing area.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">Two mobile robots, fixed soil sensors, and a local gateway beside a compatible charger form the paper’s first hypothetical deployment. The graph links plants to beds, soil zones, images, irrigation equipment, and inspection history. Monitoring and watering are separate capabilities; sowing seeds would require additional hardware and verification.</p>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">{workflow.map(([title, body], i) => <li key={title} className="rounded-2xl bg-[#163b32] p-6 text-white"><span className="text-xs font-medium uppercase tracking-widest text-emerald-200">Step {i + 1}</span><h3 className="mt-3 font-heading text-2xl">{title}</h3><p className="mt-3 text-sm leading-relaxed text-emerald-50/80">{body}</p></li>)}</ol>
          <h3 className="mt-9 text-xl font-semibold">What happens when conditions change?</h3>
          <div className="mt-4 divide-y rounded-2xl border px-5">{failures.map(([title, body]) => <div key={title} className="grid gap-2 py-5 md:grid-cols-[1fr_2fr]"><h4 className="text-sm font-semibold">{title}</h4><p className="text-sm leading-relaxed text-muted-foreground">{body}</p></div>)}</div>
          <p className="mt-5 text-sm text-muted-foreground">A human interface should show evidence, uncertainty, outstanding tasks, and reasons for deferral. Exclusive assignments and charger reservations need ownership enforcement; delayed graph replication alone cannot prevent conflicting physical actions.</p>
        </section>

        <section id="evaluation" className="scroll-mt-24 border-t py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">04 / Evaluation agenda</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">Make the energy claim testable.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">The proposed hypotheses are that reusing evidence can reduce total energy per verified successful task; relevance and freshness filters can reduce communication while preserving task quality; and explicit ownership with local autonomy can support useful work through outages without increasing conflicting actions.</p>
          <div className="mt-7 rounded-2xl border p-6"><h3 className="font-semibold">Compare four conditions</h3><ol className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{comparisons.map((label, i) => <li key={label} className="flex items-center gap-3 rounded-lg bg-muted/60 p-3"><span className="font-mono text-emerald-700">0{i + 1}</span>{label}</li>)}</ol><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Hold robot capabilities, workloads, perception models, and safety rules constant. Vary fleet size, observation reuse, network latency and outages, environmental change, sensor error, and charger contention.</p></div>
          <div className="mt-5 grid gap-5 md:grid-cols-2"><div className="rounded-2xl border p-6"><h3 className="font-semibold">Account for the whole system</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Measure sensing, motion, onboard compute, networks, gateways, attributable remote compute, and charging losses. Report standing infrastructure consumption and training energy separately, alongside task quality and conflicting action attempts.</p></div><div className="rounded-2xl border p-6"><h3 className="font-semibold">Test what adds value</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Track transferred bytes, evidence age, query latency, repeated observations, charger waiting, interventions, and recovery time. Remove freshness, relevance, charging, and ownership mechanisms individually. Message sharing matching the benefits at lower cost would weaken the proposal.</p></div></div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Begin with simulation and verified control and ownership mechanisms, then progress to bounded field trials with repeated paired workloads and uncertainty intervals. The paper does not establish global consistency, planetary scalability, or reliable causal inference. Authenticated provenance, access boundaries, revocation policies, and audit records remain design requirements.</p>
        </section>

        <section id="visuals" className="scroll-mt-24 border-t py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">05 / The original vision</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold md:text-4xl">From a world graph to a bounded experiment.</h2>
          <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">The November 1 post introduces the world-as-graph vision across physical, biological, environmental, and urban scales. The November 2 image post connects that vision to distributed robotic intelligence and the preprint. These original illustrations describe a broader ambition; TOMO focuses the research on testable agricultural coordination. The paper explicitly treats unobserved information as unknown and does not assume that thoughts or emotions can be directly observed.</p>
          <figure className="mt-8 overflow-hidden rounded-2xl border bg-card"><a href="/tomo/world-graph-original.jpg" target="_blank" rel="noreferrer" aria-label="Open original world graph illustration at full resolution"><Image src="/tomo/world-graph-original.jpg" alt="Original world-as-graph illustration connecting atoms, soil, plants, ecosystems, cities, and people through graph relationships" width={1672} height={941} sizes="(max-width: 1152px) 100vw, 1152px" className="h-auto w-full" /></a><figcaption className="space-y-2 p-5 text-sm text-muted-foreground"><p>The world as a graph database — original vision illustration, shared in both linked posts. Broad concept imagery.</p><div className="flex flex-wrap gap-5"><SourceLink href={VISION_POST}>November 1 post</SourceLink><SourceLink href={IMAGE_POST}>November 2 image post</SourceLink></div></figcaption></figure>
          <figure className="mt-6 overflow-hidden rounded-2xl border bg-card md:mx-auto md:max-w-3xl"><a href="/tomo/distributed-robotics-original.jpg" target="_blank" rel="noreferrer" aria-label="Open original distributed robotics illustration at full resolution"><Image src="/tomo/distributed-robotics-original.jpg" alt="Original distributed world graph illustration showing gardening, warehouse, infrastructure, and mobility robots with charging and synchronization gateways" width={1254} height={1254} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full" /></a><figcaption className="space-y-2 p-5 text-sm text-muted-foreground"><p>Specialized robots, shared infrastructure, and task-relevant knowledge. Original illustration from the November 2 post; broader applications extend beyond the paper’s agricultural evaluation.</p><SourceLink href={IMAGE_POST}>View original image post</SourceLink></figcaption></figure>
        </section>

        <section id="paper" className="scroll-mt-24 border-t py-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">06 / Open research</p>
          <h2 className="mt-3 max-w-4xl font-heading text-3xl font-semibold md:text-4xl">The World as a Graph Database for Distributed Robotic Intelligence and Autonomous Optimization</h2>
          <p className="mt-4 text-muted-foreground">Ilakkuvaselvi Manoharan · Independent Researcher · November 1, 2026</p>
          <p className="mt-2 text-sm text-muted-foreground">Perspective preprint, not peer reviewed · DOI: 10.5281/zenodo.23873426 · CC BY 4.0</p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm"><SourceLink href={PAPER}>Zenodo record</SourceLink><SourceLink href={PDF}><FileText className="size-4" aria-hidden="true" />Read / download PDF</SourceLink><SourceLink href="https://ilakmanoharan.substack.com/p/what-if-robots-shared-what-they-know">Companion essay</SourceLink></div>
          <details className="mt-8 rounded-2xl border bg-card open:pb-6"><summary className="cursor-pointer rounded-2xl p-6 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4">Read the complete paper on this page</summary><div className="mx-auto max-w-3xl space-y-8 px-6 text-sm leading-7 text-muted-foreground">{manuscript.map((paragraphs, i) => <section key={i} aria-label={`Manuscript page ${i + 1}`} className="space-y-4 border-t pt-6"><p className="font-mono text-xs uppercase tracking-wider">Manuscript · {i + 1} / {manuscript.length}</p>{paragraphs.map((text, j) => <p key={j} className={/^\d+ [A-Z]|^Abstract$|^References$/.test(text) ? "font-semibold text-foreground" : ""}>{text}</p>)}</section>)}</div></details>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">The complete manuscript is reproduced from the author’s open-access Zenodo PDF under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline">CC BY 4.0</a>. Text flow is adapted for the web; the original PDF is the reference version. Original post images are attributed above. New concept illustrations are AI-generated for this project page.</p>
        </section>
        <footer className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#163b32] p-6 text-white md:p-8"><div><h2 className="font-heading text-2xl">Explore TOMO together.</h2><p className="mt-2 text-sm text-emerald-100/80">Research, agricultural robotics, and bounded field-trial collaboration.</p></div><Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#163b32] hover:bg-emerald-50">Start a conversation<ArrowUpRight className="size-4" aria-hidden="true" /></Link></footer>
      </article>
    </>
  );
}
