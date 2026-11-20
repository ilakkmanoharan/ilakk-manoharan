import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import archive from "../../../../../content/tomo-posts.json";

export const metadata: Metadata = {
  title: "TOMO Blog | X Post Archive",
  description: "TOMO research updates and concept images from Ilak Manoharan’s X posts.",
  alternates: { canonical: "/projects/tomo/blog" },
};

type ArchivedPost = {
  id: string;
  date: string;
  text: string;
  summary?: boolean;
  images: { src: string; alt: string }[];
  links?: string[];
  quotedUrl?: string | null;
  replyTo?: string | null;
};

function PostText({ text }: { text: string }) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
    /^https?:\/\//.test(part) ? (
      <a key={index} href={part} className="underline underline-offset-4" target="_blank" rel="noreferrer">{part}</a>
    ) : part,
  );
}

const monthFormat = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" });
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" });

export default function TomoBlogPage() {
  const years = Map.groupBy(archive as ArchivedPost[], (post) => post.date.slice(0, 4));

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      <Link href="/projects/tomo" className="text-sm underline underline-offset-4">TOMO project</Link>
      <header className="my-8 rounded-3xl bg-[#f5f4ec] p-6 text-[#163b32] md:p-10">
        <h1 className="font-heading text-5xl font-semibold tracking-tight">TOMO Blog</h1>
        <p className="mt-4 text-lg">Research updates and illustrations from @ilakkManoharan on X.</p>
      </header>
      {Array.from(years, ([year, posts]) => (
        <details key={year} open={year === archive[0]?.date.slice(0, 4)} className="mb-4 rounded-2xl border p-4 md:p-6">
          <summary className="cursor-pointer text-2xl font-semibold">{year} <span className="text-sm font-normal text-muted-foreground">({posts.length})</span></summary>
          {Array.from(Map.groupBy(posts, (post) => post.date.slice(0, 7)), ([month, entries]) => (
            <details key={month} open={month === archive[0]?.date.slice(0, 7)} className="mt-4 border-t pt-4">
              <summary className="cursor-pointer text-lg font-medium">{monthFormat.format(new Date(month + "-01"))}</summary>
              {entries.map((post) => (
                <article key={post.id} id={post.id} className="mt-4 rounded-xl border p-4 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                    <h2 className="font-semibold"><time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time></h2>
                    <a href={`https://x.com/ilakkManoharan/status/${post.id}`} className="underline underline-offset-4">View original on X</a>
                  </div>
                  {post.summary && <p className="mt-4 text-sm text-muted-foreground">Summary from the TOMO project page</p>}
                  <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{<PostText text={post.text} />}</p>
                  {(post.links?.length || post.quotedUrl || post.replyTo) ? (
                    <nav aria-label="Post references" className="mt-4 flex flex-wrap gap-3 text-sm">
                      {post.links?.filter((url) => !post.text.includes(url)).map((url) => (
                        <a key={url} href={url} target="_blank" rel="noreferrer" className="break-all underline underline-offset-4">{url}</a>
                      ))}
                      {post.quotedUrl && <a href={post.quotedUrl} className="underline underline-offset-4" target="_blank" rel="noreferrer">View quoted post</a>}
                      {post.replyTo && <a href={post.replyTo} className="underline underline-offset-4" target="_blank" rel="noreferrer">View parent post</a>}
                    </nav>
                  ) : null}
                  {post.images.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {post.images.map(({ src, alt }) => (
                        <a key={src} href={src} className="relative block aspect-[4/3] overflow-hidden rounded-lg border">
                          <Image src={src} alt={alt} fill sizes="(min-width: 640px) 420px, 90vw" className="object-contain" />
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </details>
          ))}
        </details>
      ))}
    </main>
  );
}
