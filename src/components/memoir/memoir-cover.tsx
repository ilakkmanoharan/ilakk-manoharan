'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ChapterInfo {
  number: number;
  title: string;
  postsCount: number;
  photosCount: number;
}

interface MemoirStats {
  title: string;
  author: string;
  totalChapters: number;
  totalPosts: number;
  totalPhotos: number;
  chapters: ChapterInfo[];
}

export function MemoirCover({ stats }: { stats: MemoirStats }) {
  return (
    <div className="min-h-screen bg-[#fdf6e3] font-serif text-[#073642]">
      <div className="flex min-h-screen flex-col items-center justify-center p-8">
        <div className="max-w-2xl text-center">
          <h1 className="mb-8 font-serif text-5xl font-normal leading-tight md:text-6xl">
            {stats.title}
          </h1>
          <p className="mb-4 text-xl text-[#586e75]">
            by
          </p>
          <p className="mb-12 text-2xl">
            {stats.author}
          </p>
          <div className="mb-8 space-y-2 text-sm text-[#586e75]">
            <p>{stats.totalChapters} chapters</p>
            <p>{stats.totalPosts} posts · {stats.totalPhotos} photos</p>
            <p>2022–2026</p>
          </div>
          <Link href="/memoir/toc">
            <Button
              size="lg"
              className="bg-[#073642] font-serif hover:bg-[#073642]/90"
            >
              Begin Reading
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
