"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig, navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const currentPath = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
        <Link href="/" className="group flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {siteConfig.shortName}
          </span>
          <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground">
            Engineer · Founder · AI systems
          </span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex max-w-[70vw] flex-1 flex-wrap justify-end gap-x-3 gap-y-2 text-sm md:max-w-none md:gap-x-4"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:text-foreground",
                currentPath === item.href && "font-medium text-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
