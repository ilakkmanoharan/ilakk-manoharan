'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import type { Chapter } from '@/lib/memoir-decrypt';

interface ChapterReaderProps {
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export function ChapterReader({ chapter, prevChapter, nextChapter }: ChapterReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const allPosts = [...chapter.myLifePosts, ...chapter.myVisionPosts];
  const totalPages = allPosts.length;

  // Determine if we're on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const postsPerPage = isMobile ? 1 : 2; // Single page on mobile, two-page spread on desktop

  const startIndex = currentPage * postsPerPage;
  const currentPosts = allPosts.slice(startIndex, startIndex + postsPerPage);

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNextPage = () => {
    if (startIndex + postsPerPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Keyboard navigation
  if (typeof window !== 'undefined') {
    window.onkeydown = (e) => {
      if (e.key === 'ArrowLeft') goToPrevPage();
      if (e.key === 'ArrowRight') goToNextPage();
    };
  }

  return (
    <div className="min-h-screen bg-[#fdf6e3] font-serif text-[#073642]">
      {/* Header Navigation */}
      <div className="sticky top-0 z-10 border-b border-[#93a1a1]/20 bg-[#fdf6e3]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/memoir/toc" className="flex items-center gap-2 text-sm text-[#268bd2] hover:underline">
            <Menu className="size-4" />
            Contents
          </Link>
          <div className="text-sm text-[#586e75]">
            {chapter.number === 0 ? 'Prologue' : `Chapter ${chapter.number}`}
          </div>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {/* Chapter Title (only on first page) */}
        {currentPage === 0 && (
          <div className="mb-12 text-center">
            <div className="mb-2 text-sm uppercase tracking-wider text-[#586e75]">
              {chapter.number === 0 ? 'Prologue' : `Chapter ${chapter.number}`}
            </div>
            <h1 className="font-serif text-3xl font-normal leading-tight md:text-4xl">
              {chapter.title}
            </h1>
          </div>
        )}

        {/* Two-page spread or single page */}
        <div className="grid gap-8 md:grid-cols-2">
          {currentPosts.map((post, index) => (
            <article
              key={`${post.date}-${index}`}
              className="prose prose-lg mx-auto max-w-none font-serif prose-headings:font-serif prose-p:leading-relaxed"
            >
              <div className="mb-4 text-sm text-[#586e75]">
                {post.date}
              </div>
              <div className="whitespace-pre-wrap text-[#073642]">
                {post.text}
              </div>
              {post.hasPhoto && (
                <div className="mt-4 rounded border border-[#93a1a1]/20 bg-[#eee8d5] p-4 text-sm italic text-[#586e75]">
                  [Photo from X post]
                  {post.photoCaption && <div className="mt-2">{post.photoCaption}</div>}
                </div>
              )}
              {post.url && (
                <div className="mt-4 text-xs text-[#586e75]">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#268bd2] hover:underline"
                  >
                    Original post →
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Page Numbers */}
        <div className="mt-12 text-center text-sm text-[#586e75]">
          Page {startIndex + 1}
          {postsPerPage === 2 && startIndex + 1 < totalPages && `–${startIndex + 2}`} of {totalPages}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goToPrevPage}
            disabled={currentPage === 0}
            className="gap-2"
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>

          <div className="flex gap-2">
            {prevChapter && (
              <Link href={`/memoir/chapter/${prevChapter.number}`}>
                <Button variant="outline" size="sm">
                  ← Previous Chapter
                </Button>
              </Link>
            )}
            {nextChapter && (
              <Link href={`/memoir/chapter/${nextChapter.number}`}>
                <Button variant="outline" size="sm">
                  Next Chapter →
                </Button>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            onClick={goToNextPage}
            disabled={startIndex + postsPerPage >= totalPages}
            className="gap-2"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
