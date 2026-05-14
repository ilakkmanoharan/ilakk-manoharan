import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="font-medium text-foreground">{siteConfig.shortName}</p>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <a
            className="text-muted-foreground hover:text-foreground"
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
          <a
            className="text-muted-foreground hover:text-foreground"
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
          <a
            className="text-muted-foreground hover:text-foreground"
            href={siteConfig.links.youtube}
            target="_blank"
            rel="noreferrer"
          >
            YouTube
          </a>
          <Link
            className="text-muted-foreground hover:text-foreground"
            href="/contact"
          >
            Contact
          </Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {siteConfig.shortName}. All rights reserved.
      </div>
    </footer>
  );
}
