#!/usr/bin/env tsx
/**
 * Upload memoir content and photos to Vercel Blob
 * Run this script locally with BLOB_READ_WRITE_TOKEN env var
 * 
 * Usage:
 *   BLOB_READ_WRITE_TOKEN=your_token npx tsx scripts/upload-memoir-to-blob.ts
 */

import { put } from '@vercel/blob';
import fs from 'node:fs';
import path from 'node:path';

async function uploadMemoir() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('Get it from: https://vercel.com/dashboard → Storage → Blob → Settings');
    process.exit(1);
  }

  console.log('Uploading memoir content to Vercel Blob...\n');

  const memoirPath = '/tmp/memoir_data/memoir.json';
  if (!fs.existsSync(memoirPath)) {
    console.error('Error: memoir.json not found. Run parse-memoir-with-photos.ts first.');
    process.exit(1);
  }

  const memoirData = fs.readFileSync(memoirPath, 'utf8');
  const memoirBlob = await put('memoir/data.json', memoirData, {
    access: 'public',
    token,
  });
  console.log('✓ Uploaded memoir data:', memoirBlob.url);

  const photosDir = '/tmp/memoir_images';
  if (!fs.existsSync(photosDir)) {
    console.error('Error: Photos directory not found');
    process.exit(1);
  }

  const photoFiles = fs.readdirSync(photosDir).filter(f => f.endsWith('.jpg'));
  console.log(`\nUploading ${photoFiles.length} photos...`);

  for (const filename of photoFiles) {
    const filepath = path.join(photosDir, filename);
    const photoData = fs.readFileSync(filepath);
    
    await put(`memoir/photos/${filename}`, photoData, {
      access: 'public',
      token,
    });
    
    process.stdout.write('.');
  }

  console.log('\n\n✓ All photos uploaded!');
  console.log('\nDone! Memoir content is now in Vercel Blob storage.');
  console.log('The content is NOT in the git repository.');
}

uploadMemoir().catch(console.error);
