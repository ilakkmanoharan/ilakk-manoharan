'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';
import type { Chapter } from '@/lib/memoir-storage';

interface ChapterReaderProps {
  chapter: Chapter;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  isOwner: boolean;
  isPublished: boolean;
}

export function ChapterReader({ chapter, prevChapter, nextChapter, isOwner, isPublished }: ChapterReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [publishing, setPublishing] = useState(false);
  const [localPublishState, setLocalPublishState] = useState(isPublished);
  
  const allPosts = [...chapter.myLifePosts, ...chapter.myVisionPosts];
  const totalPages = allPosts.length;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const postsPerPage = isMobile ? 1 : 2;

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

  const handlePublishToggle = async () => {
    setPublishing(true);
    try {
      const response = await fetch('/api/memoir/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterNumber: chapter.number,
          action: localPublishState ? 'unpublish' : 'publish',
        }),
      });

      if (response.ok) {
        setLocalPublishState(!localPublishState);
      }
    } catch (error) {
      console.error('Failed to toggle publish state:', error);
    } finally {
      setPublishing(false);
    }
  };

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
          <div className="flex items-center gap-3">
            <div className="text-sm text-[#586e75]">
              {chapter.number === 0 ? 'Prologue' : `Chapter ${chapter.number}`}
            </div>
            {isOwner && (
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${
                  localPublishState ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {localPublishState ? 'Published' : 'Private'}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePublishToggle}
                  disabled={publishing}
                  className="text-xs"
                >
                  {publishing ? '...' : (localPublishState ? 'Unpublish' : 'Publish')}
                </Button>
              </div>
            )}
          </div>
          <div className="w-20" />
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
              {post.photoIndex !== undefined && (
                <div className="mt-4">
                  <Image
                    src={`/api/memoir/photo/image_${String(post.photoIndex + 1).padStart(3, '0')}.jpg`}
                    alt="Memoir photo"
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
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
