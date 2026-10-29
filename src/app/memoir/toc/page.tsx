import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isOwnerAuthenticated } from '@/lib/memoir-auth';
import { getMemoirStats } from '@/lib/memoir-storage';
import { getPublishedChapters } from '@/lib/memoir-publishing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Table of Contents — Memoir',
  description: 'Table of Contents for My Life and My Vision',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function TableOfContentsPage() {
  const isAuthenticated = await isOwnerAuthenticated();

  if (!isAuthenticated) {
    redirect('/memoir');
  }

  try {
    const stats = await getMemoirStats();
    const publishedState = await getPublishedChapters();
    
    return (
      <div className="min-h-screen bg-[#fdf6e3] font-serif text-[#073642]">
        <div className="mx-auto max-w-4xl px-8 py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-serif text-4xl font-normal">
              Contents
            </h1>
            <p className="text-lg text-[#586e75]">
              {stats.title}
            </p>
            <p className="mt-2 text-sm text-[#586e75]">
              by {stats.author}
            </p>
          </div>

          <nav className="space-y-6">
            {stats.chapters.map((chapter) => {
              const isPublished = publishedState[chapter.number] === true;
              return (
                <div key={chapter.number} className="border-b border-[#93a1a1]/20 pb-4">
                  <Link
                    href={`/memoir/chapter/${chapter.number}`}
                    className="group block hover:text-[#268bd2]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-[#586e75]">
                            {chapter.number === 0 ? 'Prologue' : `Chapter ${chapter.number}`}
                          </span>
                          {isPublished && (
                            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                              Published
                            </span>
                          )}
                          {!isPublished && (
                            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                              Private
                            </span>
                          )}
                        </div>
                        <h2 className="mt-1 font-serif text-xl font-normal leading-snug group-hover:underline">
                          {chapter.title}
                        </h2>
                      </div>
                      <div className="text-sm text-[#586e75]">
                        {chapter.postsCount} {chapter.postsCount === 1 ? 'post' : 'posts'}
                        {chapter.photosCount > 0 && `, ${chapter.photosCount} ${chapter.photosCount === 1 ? 'photo' : 'photos'}`}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>

          <div className="mt-12 flex justify-between text-sm">
            <Link
              href="/memoir"
              className="text-[#268bd2] hover:underline"
            >
              ← Back to Cover
            </Link>
            <Link
              href="/memoir/chapter/0"
              className="text-[#268bd2] hover:underline"
            >
              Begin Reading →
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Failed to load table of contents:', error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading Contents</h1>
          <p className="mt-2 text-muted-foreground">
            Unable to load table of contents.
          </p>
        </div>
      </div>
    );
  }
}
