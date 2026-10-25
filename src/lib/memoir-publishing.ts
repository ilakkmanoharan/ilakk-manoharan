/**
 * Publishing state management using Upstash Redis (Vercel KV)
 * Persists which chapters are published
 */

import { kv } from '@vercel/kv';

const PUBLISHING_KEY = 'memoir:published_chapters';

export interface PublishingState {
  [chapterNumber: number]: boolean;
}

export async function getPublishedChapters(): Promise<PublishingState> {
  try {
    const state = await kv.get<PublishingState>(PUBLISHING_KEY);
    return state || {};
  } catch (error) {
    console.error('Error fetching publishing state:', error);
    return {};
  }
}

export async function isChapterPublished(chapterNumber: number): Promise<boolean> {
  const state = await getPublishedChapters();
  return state[chapterNumber] === true;
}

export async function publishChapter(chapterNumber: number): Promise<void> {
  const state = await getPublishedChapters();
  state[chapterNumber] = true;
  await kv.set(PUBLISHING_KEY, state);
}

export async function unpublishChapter(chapterNumber: number): Promise<void> {
  const state = await getPublishedChapters();
  state[chapterNumber] = false;
  await kv.set(PUBLISHING_KEY, state);
}

export async function getPublishedChapterNumbers(): Promise<number[]> {
  const state = await getPublishedChapters();
  return Object.entries(state)
    .filter(([_, published]) => published)
    .map(([num, _]) => parseInt(num, 10));
}
