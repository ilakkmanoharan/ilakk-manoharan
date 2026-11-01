/**
 * Memoir decryption utilities
 * Server-side only - decrypts encrypted memoir content
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

export interface Post {
  date: string;
  url: string;
  text: string;
  hasPhoto: boolean;
  photoCaption?: string;
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
}

interface EncryptedData {
  encrypted: string;
  iv: string;
}

function getDecryptionKey(): Buffer {
  const keyBase64 = process.env.MEMOIR_ENCRYPTION_KEY;
  if (!keyBase64) {
    throw new Error('MEMOIR_ENCRYPTION_KEY environment variable is required');
  }
  return Buffer.from(keyBase64, 'base64');
}

function decryptData(encryptedData: EncryptedData, key: Buffer): string {
  const iv = Buffer.from(encryptedData.iv, 'base64');
  const encrypted = Buffer.from(encryptedData.encrypted, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

let cachedMemoirData: MemoirData | null = null;

export function getDecryptedMemoir(): MemoirData {
  // Return cached data if available (for dev performance)
  if (cachedMemoirData && process.env.NODE_ENV === 'development') {
    return cachedMemoirData;
  }

  const dataPath = path.join(process.cwd(), 'content', 'memoir', 'data.enc');
  if (!fs.existsSync(dataPath)) {
    throw new Error('Encrypted memoir data not found');
  }

  const encryptedData: EncryptedData = JSON.parse(
    fs.readFileSync(dataPath, 'utf8')
  );
  const key = getDecryptionKey();
  const decryptedJson = decryptData(encryptedData, key);
  const memoirData: MemoirData = JSON.parse(decryptedJson);

  if (process.env.NODE_ENV === 'development') {
    cachedMemoirData = memoirData;
  }

  return memoirData;
}

export function getAllChapters(): Array<Chapter> {
  const memoir = getDecryptedMemoir();
  return [memoir.prologue, ...memoir.chapters];
}

export function getChapterByNumber(num: number): Chapter | null {
  const chapters = getAllChapters();
  return chapters.find((ch) => ch.number === num) || null;
}

export function getMemoirStats() {
  const memoir = getDecryptedMemoir();
  const allChapters = [memoir.prologue, ...memoir.chapters];
  
  const totalPosts = allChapters.reduce(
    (sum, ch) => sum + ch.myLifePosts.length + ch.myVisionPosts.length,
    0
  );
  
  const totalPhotos = allChapters.reduce(
    (sum, ch) =>
      sum +
      ch.myLifePosts.filter((p) => p.hasPhoto).length +
      ch.myVisionPosts.filter((p) => p.hasPhoto).length,
    0
  );

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
        ch.myLifePosts.filter((p) => p.hasPhoto).length +
        ch.myVisionPosts.filter((p) => p.hasPhoto).length,
    })),
  };
}
