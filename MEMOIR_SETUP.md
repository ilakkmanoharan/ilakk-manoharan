# Memoir Setup Instructions

Complete setup guide for the private memoir reader.

## Architecture - Privacy First

**Storage:**
- Content in **Vercel Blob** (NOT in this public repository)
- Photos in **Vercel Blob** (NOT in /public)
- Publishing state in **Upstash Redis** (Vercel KV)

**Security:**
- NO content, keys, or secrets in git repository
- Server-side only access to Blob storage
- HttpOnly JWT session cookies
- Password authentication

## Required Integrations

### 1. Vercel Blob Store
Create in Vercel Dashboard → Storage → Create Blob Store

### 2. Upstash Redis (Vercel KV)
Create in Vercel Dashboard → Storage → Create KV Store

## Environment Variables

All must be set in Vercel Dashboard → Settings → Environment Variables:

### MEMOIR_PASSWORD
Owner authentication password.

**Generate:** Choose a strong password or `openssl rand -base64 24`

### MEMOIR_JWT_SECRET
JWT signing secret (32+ characters required).

**Generate:** `openssl rand -base64 32`

### MEMOIR_BLOB_URL
URL to memoir/data.json in Vercel Blob.

**Obtain:** After running upload script (see below)

### MEMOIR_PHOTOS_BLOB_URL
Base URL for memoir photos.

**Format:** `https://[your-id].public.blob.vercel-storage.com/memoir/photos`

### KV_REST_API_URL
Upstash Redis URL.

**Obtain:** From Vercel KV setup

### KV_REST_API_TOKEN
Upstash Redis token.

**Obtain:** From Vercel KV setup

### BLOB_READ_WRITE_TOKEN (local only)
Token to upload content to Blob.

**Obtain:** Vercel Dashboard → Storage → Blob → Settings
**Use:** Only for running upload script locally (NOT in Vercel)

## Setup Steps

### 1. Parse Content Locally
```bash
npx tsx scripts/parse-memoir-with-photos.ts
```

This creates:
- `/tmp/memoir_data/memoir.json` (content)
- `/tmp/memoir_images/*.jpg` (89 photos)

### 2. Create Vercel Blob Store
- Vercel Dashboard → Storage → Create Blob Store
- Copy Read-Write Token

### 3. Upload to Blob
```bash
BLOB_READ_WRITE_TOKEN=your_token npx tsx scripts/upload-memoir-to-blob.ts
```

Save the URLs output:
- Data URL → `MEMOIR_BLOB_URL`
- Photos base URL → `MEMOIR_PHOTOS_BLOB_URL`

### 4. Create Vercel KV Store
- Vercel Dashboard → Storage → Create KV Store
- Copy `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 5. Set Environment Variables
Add all 6 variables to Vercel:
- MEMOIR_PASSWORD
- MEMOIR_JWT_SECRET
- MEMOIR_BLOB_URL
- MEMOIR_PHOTOS_BLOB_URL
- KV_REST_API_URL
- KV_REST_API_TOKEN

### 6. Deploy
Push to GitHub and deploy.

## Content Summary

- **15 chapters** (Prologue + 14 chapters)
- **420 posts** from X, verbatim
- **89 photos** embedded
- Filtered: Bank of America, rajesh/Generic Solutions mentions excluded

## Features

### Publishing Controls
- Owner sees Private/Published badge per chapter
- Publish/Unpublish button in chapter header
- State persists in Upstash Redis
- Public users can read published chapters only
- No redeploy needed
- All chapters private initially

### Reader Experience
- Beautiful book typography (serif, sepia tones)
- Two-page spread (desktop), single page (mobile)
- Keyboard navigation (arrow keys)
- Page numbers and chapter navigation
- Photos displayed inline

### Security
- Content NEVER in git repository
- Photos NEVER in /public
- Server-side Blob access only
- robots.txt disallows /memoir/*
- noindex meta tags
- HttpOnly cookies prevent XSS

## Local Development with Dev Fixture

For screenshots and testing without Blob setup:

```bash
USE_DEV_FIXTURE=true MEMOIR_PASSWORD=test123 MEMOIR_JWT_SECRET=$(openssl rand -base64 32) npm run dev
```

The dev fixture provides minimal test data (not used in production).

## Verification

```bash
# Should return only login page
curl https://ilakk-manoharan.vercel.app/memoir

# Should show disallow
curl https://ilakk-manoharan.vercel.app/robots.txt
```

## Publishing Workflow

1. Owner logs in at /memoir
2. Navigates to chapter
3. Clicks "Publish" button in header
4. Chapter immediately available to public
5. Click "Unpublish" to make private again

State persists - no redeploy needed.

## Notes

- Memoir content is NOT in this repository
- Photos are NOT in this repository
- NO keys, passwords, or secrets committed
- Upload script run locally once
- Content can be updated by re-running upload script
