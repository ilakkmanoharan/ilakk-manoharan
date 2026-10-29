import { redirect, notFound } from 'next/navigation';
import { isOwnerAuthenticated } from '@/lib/memoir-auth';
import { getChapterByNumber, getAllChapters, type Chapter } from '@/lib/memoir-storage';
import { isChapterPublished } from '@/lib/memoir-publishing';
import { ChapterReader } from '@/components/memoir/chapter-reader';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ number: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { number } = await params;
  const chapterNum = parseInt(number, 10);
  
  try {
    const chapter = await getChapterByNumber(chapterNum);
    return {
      title: chapter
        ? `${chapterNum === 0 ? 'Prologue' : `Chapter ${chapterNum}`}: ${chapter.title} — Memoir`
        : 'Chapter Not Found — Memoir',
      description: `Reading ${chapter?.title || 'chapter'} from My Life and My Vision`,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: 'Memoir',
      robots: { index: false, follow: false },
    };
  }
}

export default async function ChapterPage({ params }: PageProps) {
  const { number } = await params;
  const chapterNum = parseInt(number, 10);

  if (isNaN(chapterNum)) {
    notFound();
  }

  const isAuthenticated = await isOwnerAuthenticated();
  const published = await isChapterPublished(chapterNum);

  if (!isAuthenticated && !published) {
    redirect('/memoir');
  }

  try {
    const chapter = await getChapterByNumber(chapterNum);
    if (!chapter) {
      notFound();
    }

    const allChapters = await getAllChapters();
    const currentIndex = allChapters.findIndex((ch) => ch.number === chapterNum);
    const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
    const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

    return (
      <ChapterReader
        chapter={chapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        isOwner={isAuthenticated}
        isPublished={published}
      />
    );
  } catch (error) {
    console.error('Failed to load chapter:', error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading Chapter</h1>
          <p className="mt-2 text-muted-foreground">
            Unable to load chapter content.
          </p>
        </div>
      </div>
    );
  }
}
