import { NextRequest, NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/memoir-auth';
import { publishChapter, unpublishChapter } from '@/lib/memoir-publishing';

export async function POST(request: NextRequest) {
  try {
    const isAuthenticated = await isOwnerAuthenticated();
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { chapterNumber, action } = body;

    if (typeof chapterNumber !== 'number' || !['publish', 'unpublish'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      );
    }

    if (action === 'publish') {
      await publishChapter(chapterNumber);
    } else {
      await unpublishChapter(chapterNumber);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
