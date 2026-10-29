#!/usr/bin/env tsx
/**
 * Parse memoir content with photos from DOCX
 * Does NOT store encryption keys or content in repo
 * Outputs JSON that will be uploaded to Vercel Blob
 */

import fs from 'node:fs';
import path from 'node:path';

interface Post {
  date: string;
  url: string;
  text: string;
  photoIndex?: number;
}

interface Chapter {
  number: number;
  title: string;
  myLifePosts: Post[];
  myVisionPosts: Post[];
}

interface MemoirData {
  title: string;
  author: string;
  prologue: Chapter;
  chapters: Chapter[];
  photos: Array<{
    filename: string;
    caption?: string;
  }>;
}

function shouldExcludePost(text: string): boolean {
  const lowerText = text.toLowerCase();
  return (
    lowerText.includes('bank of america') ||
    lowerText.includes('rajesh gensol') ||
    lowerText.includes('generic solutions')
  );
}

function parseMemoir(content: string): MemoirData {
  const lines = content.split('\n');
  const memoir: MemoirData = {
    title: 'My Life and My Vision',
    author: 'Ilakkuvaselvi (Ilak) Manoharan',
    prologue: {
      number: 0,
      title: 'Me as a Baby, Smiling',
      myLifePosts: [],
      myVisionPosts: [],
    },
    chapters: [],
    photos: [],
  };

  let currentChapter: Chapter | null = null;
  let currentSection: 'myLife' | 'myVision' | null = null;
  let currentPost: Partial<Post> = {};
  let inPost = false;
  let postText: string[] = [];
  let photoIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      if (inPost && postText.length > 0) {
        const fullText = postText.join('\n').trim();
        if (!shouldExcludePost(fullText)) {
          const post: Post = {
            date: currentPost.date || '',
            url: currentPost.url || '',
            text: fullText,
            photoIndex: currentPost.photoIndex,
          };

          if (currentChapter) {
            if (currentSection === 'myLife') {
              currentChapter.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              currentChapter.myVisionPosts.push(post);
            }
          } else if (currentSection) {
            if (currentSection === 'myLife') {
              memoir.prologue.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              memoir.prologue.myVisionPosts.push(post);
            }
          }
        }
        inPost = false;
        postText = [];
        currentPost = {};
      }
      continue;
    }

    if (line.startsWith('Prologue:')) {
      memoir.prologue.title = line.replace('Prologue:', '').trim();
      currentChapter = null;
      continue;
    }

    if (line.startsWith('Chapter ')) {
      const match = line.match(/Chapter (\d+):\s*(.+)/);
      if (match) {
        const number = parseInt(match[1], 10);
        const title = match[2].trim();
        currentChapter = {
          number,
          title,
          myLifePosts: [],
          myVisionPosts: [],
        };
        memoir.chapters.push(currentChapter);
        currentSection = null;
      }
      continue;
    }

    if (line === 'My Life') {
      currentSection = 'myLife';
      continue;
    }

    if (line === 'My Vision') {
      currentSection = 'myVision';
      continue;
    }

    const dateMatch = line.match(/^([A-Z][a-z]+\s+\d+,\s+\d{4})\s+·\s+(https:\/\/.+)/);
    if (dateMatch) {
      inPost = true;
      currentPost = {
        date: dateMatch[1],
        url: dateMatch[2],
      };
      continue;
    }

    if (line.startsWith('Photo I posted with this post')) {
      if (currentPost && photoIndex < 89) {
        currentPost.photoIndex = photoIndex;
        memoir.photos[photoIndex] = {
          filename: `image_${String(photoIndex + 1).padStart(3, '0')}.jpg`,
          caption: line,
        };
        photoIndex++;
      }
      continue;
    }

    if (line === '—') {
      if (inPost && postText.length > 0) {
        const fullText = postText.join('\n').trim();
        if (!shouldExcludePost(fullText)) {
          const post: Post = {
            date: currentPost.date || '',
            url: currentPost.url || '',
            text: fullText,
            photoIndex: currentPost.photoIndex,
          };

          if (currentChapter) {
            if (currentSection === 'myLife') {
              currentChapter.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              currentChapter.myVisionPosts.push(post);
            }
          } else if (currentSection) {
            if (currentSection === 'myLife') {
              memoir.prologue.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              memoir.prologue.myVisionPosts.push(post);
            }
          }
        }
        inPost = false;
        postText = [];
        currentPost = {};
      }
      continue;
    }

    if (inPost) {
      postText.push(line);
    }
  }

  return memoir;
}

function main() {
  const uploadsDir = '/home/ubuntu/.cursor/projects/workspace/uploads';
  const memoirFile = path.join(uploadsDir, 'Memoir_-_My_Life_and_My_Vision_0502.txt');

  if (!fs.existsSync(memoirFile)) {
    console.error('Memoir file not found:', memoirFile);
    process.exit(1);
  }

  const content = fs.readFileSync(memoirFile, 'utf8');
  const memoir = parseMemoir(content);

  const tempDir = '/tmp/memoir_data';
  fs.mkdirSync(tempDir, { recursive: true });

  fs.writeFileSync(
    path.join(tempDir, 'memoir.json'),
    JSON.stringify(memoir, null, 2),
    'utf8'
  );

  // Print statistics
  console.log('Memoir parsing complete!\n');
  console.log('Title:', memoir.title);
  console.log('Author:', memoir.author);
  console.log(`\nPrologue: ${memoir.prologue.title}`);
  console.log(`  My Life posts: ${memoir.prologue.myLifePosts.length}`);
  console.log(`  My Vision posts: ${memoir.prologue.myVisionPosts.length}`);

  memoir.chapters.forEach((ch) => {
    const totalPosts = ch.myLifePosts.length + ch.myVisionPosts.length;
    const totalPhotos = ch.myLifePosts.filter(p => p.photoIndex !== undefined).length + 
                       ch.myVisionPosts.filter(p => p.photoIndex !== undefined).length;
    console.log(`\nChapter ${ch.number}: ${ch.title}`);
    console.log(`  My Life posts: ${ch.myLifePosts.length}`);
    console.log(`  My Vision posts: ${ch.myVisionPosts.length}`);
    console.log(`  Total posts: ${totalPosts}`);
    console.log(`  Photos: ${totalPhotos}`);
  });

  const totalChapters = memoir.chapters.length + 1;
  const totalPosts = memoir.prologue.myLifePosts.length + memoir.prologue.myVisionPosts.length + 
    memoir.chapters.reduce((sum, ch) => sum + ch.myLifePosts.length + ch.myVisionPosts.length, 0);
  const totalPhotos = memoir.photos.length;

  console.log('\n===================');
  console.log('TOTALS');
  console.log('===================');
  console.log('Total chapters (including prologue):', totalChapters);
  console.log('Total posts:', totalPosts);
  console.log('Total photos:', totalPhotos);
  console.log('\nData saved to:', path.join(tempDir, 'memoir.json'));
  console.log('Photos extracted to: /tmp/memoir_images/');
  console.log('\n⚠️  IMPORTANT: This data will be uploaded to Vercel Blob, NOT committed to the repo');
}

main();
