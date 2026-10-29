/**
 * Memoir storage - fetches content from Vercel Blob (server-side only)
 * Content is NOT in the git repository
 */

export interface Post {
  date: string;
  url: string;
  text: string;
  photoIndex?: number;
}

export interface Chapter {
  number: number;
  title: string;
  myLifePosts: Post[];
  myVisionPosts: Post[];
}

export interface MemoirData {
  title: string;
  author: string;
  prologue: Chapter;
  chapters: Chapter[];
  photos: Array<{
    filename: string;
    caption?: string;
  }>;
}

let cachedMemoirData: MemoirData | null = null;

// Dev-only local fixture for testing/screenshots (never used in production)
function getDevFixture(): MemoirData {
  return {
    title: 'My Life and My Vision',
    author: 'Ilakkuvaselvi (Ilak) Manoharan',
    prologue: {
      number: 0,
      title: 'Me as a Baby, Smiling',
      myLifePosts: [
        {
          date: 'March 3, 2026',
          url: 'https://x.com/ilakkManoharan/status/123',
          text: 'This is me as a baby, smiling with hopes and dreams...',
        },
      ],
      myVisionPosts: [],
    },
    chapters: [
      {
        number: 1,
        title: 'A Dream From My Childhood',
        myLifePosts: [
          {
            date: 'April 14, 2023',
            url: 'https://x.com/ilakkManoharan/status/456',
            text: 'I always had a dream, from my childhood, to come to USA and work as a software engineer.',
            photoIndex: 0,
          },
        ],
        myVisionPosts: [],
      },
    ],
    photos: [
      { filename: 'image_001.jpg', caption: 'Photo from childhood' },
    ],
  };
}

export async function fetchMemoirFromBlob(): Promise<MemoirData> {
  // Dev fixture for local testing/screenshots only
  if (process.env.USE_DEV_FIXTURE === 'true') {
    return getDevFixture();
  }

  // Return cached in development
  if (cachedMemoirData && process.env.NODE_ENV === 'development') {
    return cachedMemoirData;
  }

  const blobUrl = process.env.MEMOIR_BLOB_URL;
  if (!blobUrl) {
    throw new Error('MEMOIR_BLOB_URL environment variable is required');
  }

  try {
    const response = await fetch(blobUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch memoir: ${response.statusText}`);
    }

    const data: MemoirData = await response.json();
    
    if (process.env.NODE_ENV === 'development') {
      cachedMemoirData = data;
    }

    return data;
  } catch (error) {
    console.error('Error fetching memoir from Blob:', error);
    throw new Error('Unable to load memoir content');
  }
}

export async function getAllChapters(): Promise<Chapter[]> {
  const memoir = await fetchMemoirFromBlob();
  return [memoir.prologue, ...memoir.chapters];
}

export async function getChapterByNumber(num: number): Promise<Chapter | null> {
  const chapters = await getAllChapters();
  return chapters.find((ch) => ch.number === num) || null;
}

export async function getMemoirStats() {
  const memoir = await fetchMemoirFromBlob();
  const allChapters = [memoir.prologue, ...memoir.chapters];
  
  const totalPosts = allChapters.reduce(
    (sum, ch) => sum + ch.myLifePosts.length + ch.myVisionPosts.length,
    0
  );
  
  const totalPhotos = memoir.photos.length;

  return {
    title: memoir.title,
    author: memoir.author,
    totalChapters: allChapters.length,
    totalPosts,
    totalPhotos,
    chapters: allChapters.map((ch) => ({
      number: ch.number,
      title: ch.title,
      postsCount: ch.myLifePosts.length + ch.myVisionPosts.length,
      photosCount:
        ch.myLifePosts.filter((p) => p.photoIndex !== undefined).length +
        ch.myVisionPosts.filter((p) => p.photoIndex !== undefined).length,
    })),
  };
}
