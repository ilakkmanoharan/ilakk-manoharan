import { NextRequest, NextResponse } from 'next/server';
import { isOwnerAuthenticated } from '@/lib/memoir-auth';

interface RouteContext {
  params: Promise<{ filename: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const isAuthenticated = await isOwnerAuthenticated();
    
    if (!isAuthenticated) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { filename } = await context.params;
    const photoBlobUrl = process.env.MEMOIR_PHOTOS_BLOB_URL;
    
    if (!photoBlobUrl) {
      return new NextResponse('Photo storage not configured', { status: 500 });
    }

    const photoUrl = `${photoBlobUrl}/${filename}`;
    
    const photoResponse = await fetch(photoUrl);
    
    if (!photoResponse.ok) {
      return new NextResponse('Photo not found', { status: 404 });
    }

    const photoData = await photoResponse.arrayBuffer();
    
    return new NextResponse(photoData, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'private, max-age=31536000',
      },
    });
  } catch (error) {
    console.error('Photo fetch error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
