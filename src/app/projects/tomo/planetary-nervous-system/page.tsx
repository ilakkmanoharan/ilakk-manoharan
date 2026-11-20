import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const title = "TOMO and the Planetary Nervous System";
const path = "/projects/tomo/planetary-nervous-system";
const description = "What if a robot could arrive at a new place and learn how to work there from the place itself?";
const dockImage = {
  src: "/tomo/garden-dock.webp",
  alt: "A gardener authorizes TOMO at the dock beside a map showing a route to the tomato beds",
  width: 1672,
  height: 941,
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    title,
    description,
    url: path,
    images: [{ url: dockImage.src, alt: dockImage.alt, width: dockImage.width, height: dockImage.height }],
  },
  twitter: { card: "summary_large_image", title, description, images: [dockImage.src] },
};

export default function PlanetaryNervousSystemPage() {
  return (
    <article className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
      <Link href="/projects/tomo" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
        Back to TOMO
      </Link>

      <header className="mt-8 overflow-hidden rounded-3xl border border-emerald-950/15 bg-[#f5f4ec] text-[#163b32]">
        <div className="p-6 md:p-10">
          <h1 className="max-w-4xl font-heading text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg font-semibold leading-relaxed md:text-xl">{description}</p>
        </div>
        <Image {...dockImage} sizes="(max-width: 1152px) 100vw, 1152px" preload className="h-auto w-full" />
      </header>

      <div className="mx-auto mt-10 max-w-3xl space-y-5 leading-relaxed md:mt-14 md:text-lg">
        <p>
          Imagine taking TOMO to a friend’s garden. Your friend authorizes it at the dock. The local node shares a map, landmarks, permitted routes, and a task brief. TOMO checks the map against what its cameras see and heads toward the tomato bed. The internet can be down for the whole visit. The garden already knows where the tomatoes are.
        </p>
        <p>
          That’s the idea behind <strong>TOMO and the Planetary Nervous System</strong>. I’m designing it around <strong>distributed spatial intelligence</strong>. Each place builds and keeps its own knowledge, and authorized robots can use that knowledge when they arrive.
        </p>
      </div>

      <section className="mt-12 border-t pt-10 md:mt-16 md:pt-14">
        <h2 className="font-heading text-3xl font-semibold md:text-4xl">Where the intelligence lives</h2>
        <ul className="mt-6 grid gap-4 leading-relaxed lg:grid-cols-3">
          <li className="rounded-2xl border bg-card p-6">
            <strong>TOMO handles immediate decisions.</strong> For the first prototype, I’d use an NVIDIA Jetson Orin Nano Super, a depth camera, and a dedicated motor controller. TOMO uses its sensors to locate itself, detect a wheelbarrow in its path, and stop on its own.
          </li>
          <li className="rounded-2xl border bg-card p-6">
            <strong>The garden node holds the world graph and makes site decisions.</strong> It knows where each plant is, when it was last watered, and what changed since the last inspection. It runs <strong>local inference</strong> to interpret new observations and uses that <strong>local intelligence</strong> to decide what to do while the information is still fresh. If a plant looks wilted, the node can check soil moisture and watering history before assigning a task. Moving heavier inference to the garden node can reduce onboard compute power and heat.
          </li>
          <li className="rounded-2xl border bg-card p-6">
            <strong>Group and city hubs coordinate across sites.</strong> A shared hub could serve 10–20 nodes, run larger models, and spot trends across gardens. City hubs can route overflow between groups, and the cloud can add capacity for work that can wait. The garden node checks current conditions before acting on a hub’s recommendation.
          </li>
        </ul>
        <p className="mx-auto mt-8 max-w-3xl leading-relaxed md:text-lg">
          TOMO can exchange observations and instructions over local Wi‑Fi or at a physical dock, recharge if needed, and carry out an assigned inspection between connections. <strong>The robot travels. The garden keeps its memory.</strong>
        </p>
      </section>

      <section className="mt-12 border-t pt-10 md:mt-16 md:pt-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-3xl font-semibold md:text-4xl">Local-first bandwidth</h2>
          <p className="mt-4 text-lg font-semibold leading-relaxed md:text-xl">
            What if the nodes that understand a place also decide what needs to travel over the network?
          </p>
        </div>
        <Image
          src="/tomo/connected-gardens.webp"
          alt="Garden rovers and local nodes connected to a shared hub, a city, and a satellite"
          width={1672}
          height={941}
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="mt-8 h-auto w-full rounded-3xl border"
        />
        <div className="mx-auto mt-8 max-w-3xl space-y-5 leading-relaxed md:text-lg">
          <p>
            Local nodes could cache frequently needed data, schedule transfers, and send compact instructions to nearby robots. Fiber and satellite links could carry model updates, selected observations, and jobs that need shared compute. Private nodes could control what they share, while public nodes could provide connectivity and relay relevant information between areas.
          </p>
          <p>
            Perhaps the future of connectivity is about building <strong>distributed intelligence that reduces how much bandwidth we need</strong>. When places can process information and make decisions locally, wider connectivity becomes a resource they use on demand.
          </p>
        </div>
      </section>
    </article>
  );
}
