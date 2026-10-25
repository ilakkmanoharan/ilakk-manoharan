#!/usr/bin/env tsx
/**
 * Parse memoir content from the uploaded DOCX files
 * Extracts chapters, posts, and photo references
 * Filters out Bank of America and rajesh/Generic Solutions mentions
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

interface Post {
  date: string;
  url: string;
  text: string;
  hasPhoto: boolean;
  photoCaption?: string;
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
}

function shouldExcludePost(text: string): boolean {
  const lowerText = text.toLowerCase();
  // Exclude posts mentioning Bank of America or rajesh/Generic Solutions
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
  };

  let currentChapter: Chapter | null = null;
  let currentSection: 'myLife' | 'myVision' | null = null;
  let currentPost: Partial<Post> = {};
  let inPost = false;
  let postText: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      if (inPost && postText.length > 0) {
        // End of post
        const fullText = postText.join('\n').trim();
        if (!shouldExcludePost(fullText)) {
          const post: Post = {
            date: currentPost.date || '',
            url: currentPost.url || '',
            text: fullText,
            hasPhoto: currentPost.hasPhoto || false,
            photoCaption: currentPost.photoCaption,
          };

          if (currentChapter) {
            if (currentSection === 'myLife') {
              currentChapter.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              currentChapter.myVisionPosts.push(post);
            }
          } else if (currentSection) {
            // Prologue
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

    // Check for prologue or chapter heading
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

    // Check for section headers
    if (line === 'My Life') {
      currentSection = 'myLife';
      continue;
    }

    if (line === 'My Vision') {
      currentSection = 'myVision';
      continue;
    }

    // Check for post date/URL
    const dateMatch = line.match(/^([A-Z][a-z]+\s+\d+,\s+\d{4})\s+·\s+(https:\/\/.+)/);
    if (dateMatch) {
      inPost = true;
      currentPost = {
        date: dateMatch[1],
        url: dateMatch[2],
        hasPhoto: false,
      };
      continue;
    }

    // Check for photo indicator
    if (line.startsWith('Photo I posted with this post')) {
      if (currentPost) {
        currentPost.hasPhoto = true;
        currentPost.photoCaption = line;
      }
      continue;
    }

    // Check for end of post marker
    if (line === '—') {
      if (inPost && postText.length > 0) {
        const fullText = postText.join('\n').trim();
        if (!shouldExcludePost(fullText)) {
          const post: Post = {
            date: currentPost.date || '',
            url: currentPost.url || '',
            text: fullText,
            hasPhoto: currentPost.hasPhoto || false,
            photoCaption: currentPost.photoCaption,
          };

          if (currentChapter) {
            if (currentSection === 'myLife') {
              currentChapter.myLifePosts.push(post);
            } else if (currentSection === 'myVision') {
              currentChapter.myVisionPosts.push(post);
            }
          } else if (currentSection) {
            // Prologue
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

    // Accumulate post text
    if (inPost) {
      postText.push(line);
    }
  }

  return memoir;
}

function encryptData(data: string, key: Buffer): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(data, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return {
    encrypted,
    iv: iv.toString('base64'),
  };
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

  // Generate encryption key (32 bytes for AES-256)
  const encryptionKey = crypto.randomBytes(32);

  // Encrypt the memoir data
  const memoirJson = JSON.stringify(memoir, null, 2);
  const { encrypted, iv } = encryptData(memoirJson, encryptionKey);

  // Save encrypted data
  const dataDir = path.join(process.cwd(), 'content', 'memoir');
  fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(
    path.join(dataDir, 'data.enc'),
    JSON.stringify({ encrypted, iv }),
    'utf8'
  );

  // Save key to a separate file (this will be added to .gitignore)
  fs.writeFileSync(
    path.join(dataDir, 'key.txt'),
    `MEMOIR_ENCRYPTION_KEY=${encryptionKey.toString('base64')}\n\nAdd this to your Vercel environment variables.`,
    'utf8'
  );

  // Print statistics
  console.log('Memoir parsing complete!\n');
  console.log('Title:', memoir.title);
  console.log('Author:', memoir.author);
  console.log('\nPrologue:', memoir.prologue.title);
  console.log('  My Life posts:', memoir.prologue.myLifePosts.length);
  console.log('  My Vision posts:', memoir.prologue.myVisionPosts.length);
  console.log('  Total posts:', memoir.prologue.myLifePosts.length + memoir.prologue.myVisionPosts.length);
  console.log('  Photos:', memoir.prologue.myLifePosts.filter(p => p.hasPhoto).length + memoir.prologue.myVisionPosts.filter(p => p.hasPhoto).length);

  memoir.chapters.forEach((ch) => {
    const totalPosts = ch.myLifePosts.length + ch.myVisionPosts.length;
    const totalPhotos = ch.myLifePosts.filter(p => p.hasPhoto).length + ch.myVisionPosts.filter(p => p.hasPhoto).length;
    console.log(`\nChapter ${ch.number}: ${ch.title}`);
    console.log(`  My Life posts: ${ch.myLifePosts.length}`);
    console.log(`  My Vision posts: ${ch.myVisionPosts.length}`);
    console.log(`  Total posts: ${totalPosts}`);
    console.log(`  Photos: ${totalPhotos}`);
  });

  const totalChapters = memoir.chapters.length + 1; // +1 for prologue
  const totalPosts = memoir.prologue.myLifePosts.length + memoir.prologue.myVisionPosts.length + 
    memoir.chapters.reduce((sum, ch) => sum + ch.myLifePosts.length + ch.myVisionPosts.length, 0);
  const totalPhotos = memoir.prologue.myLifePosts.filter(p => p.hasPhoto).length + memoir.prologue.myVisionPosts.filter(p => p.hasPhoto).length +
    memoir.chapters.reduce((sum, ch) => sum + ch.myLifePosts.filter(p => p.hasPhoto).length + ch.myVisionPosts.filter(p => p.hasPhoto).length, 0);

  console.log('\n===================');
  console.log('TOTALS');
  console.log('===================');
  console.log('Total chapters (including prologue):', totalChapters);
  console.log('Total posts:', totalPosts);
  console.log('Total photos:', totalPhotos);
  console.log('\nEncrypted data saved to: content/memoir/data.enc');
  console.log('Encryption key saved to: content/memoir/key.txt (DO NOT COMMIT THIS FILE)');
}

main();
