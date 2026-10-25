import { redirect } from 'next/navigation';
import { isOwnerAuthenticated } from '@/lib/memoir-auth';
import { getMemoirStats } from '@/lib/memoir-decrypt';
import { MemoirCover } from '@/components/memoir/memoir-cover';
import { MemoirLogin } from '@/components/memoir/memoir-login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Memoir — My Life and My Vision',
  description: 'A private memoir by Ilak Manoharan',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MemoirPage() {
  const isAuthenticated = await isOwnerAuthenticated();

  if (!isAuthenticated) {
    return <MemoirLogin />;
  }

  try {
    const stats = getMemoirStats();
    return <MemoirCover stats={stats} />;
  } catch (error) {
    console.error('Failed to load memoir:', error);
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error Loading Memoir</h1>
          <p className="mt-2 text-muted-foreground">
            Unable to load memoir content. Please contact the site owner.
          </p>
        </div>
      </div>
    );
  }
}
