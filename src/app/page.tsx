import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FadeIn } from "@/components/fade-in";
import { IntroVideo } from "@/components/intro-video";
import { ViewTracker } from "@/components/view-tracker";
import { loadProjectsForPage } from "@/lib/projects-content";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const featured = loadProjectsForPage()
    .filter((p) => p.featured)
    .slice(0, 3);

  return (
    <>
      <ViewTracker path="/" resourceType="page" resourceSlug="home" />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <FadeIn>
            <p className="font-heading text-sm font-medium tracking-wide text-primary">
              Ilak Manoharan — Engineer, Founder, AI Systems Builder
            </p>
            <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Systems, products, and ideas—built with care.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {siteConfig.heroGreeting}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className={cn(buttonVariants({ size: "lg" }), "shadow-sm")}
              >
                View Projects
              </Link>
              <Link
                href="/startups"
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                Explore Startup Catalog
              </Link>
              <Link
                href="/recruiter"
                className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              >
                Recruiter Portal
              </Link>
              <Link
                href="/schedule"
                className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}
              >
                Schedule a Meeting
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={0.08} className="flex flex-col items-start gap-4">
            <IntroVideo />
            <p className="text-sm text-muted-foreground">
              Welcome—this site is a living portfolio of engineering work,
              founder experiments, and how I think about building in public.
            </p>
          </FadeIn>
        </section>

        <section className="mt-20 border-t border-border pt-14">
          <h2 className="font-heading text-2xl font-semibold tracking-tight">
            Featured highlights
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-primary">
                  {p.status}
                </p>
                <p className="mt-2 font-medium text-foreground">{p.title}</p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {p.description}
                </p>
                <Link
                  href="/projects"
                  className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
                >
                  View all projects
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
