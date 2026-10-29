# Memoir Setup Instructions

This document describes how to set up the private memoir reader feature on Vercel.

## Overview

The memoir feature is a private, password-protected book reader that displays Ilak's personal memoir "My Life and My Vision" built from her X posts. All content is encrypted at rest and only accessible to authenticated users.

## Architecture

- **Content Storage**: Encrypted JSON file (`content/memoir/data.enc`) committed to the repo
- **Authentication**: Password-based with HttpOnly session cookies (JWT)
- **Privacy**: Server-side decryption only, content never sent to unauthenticated clients
- **Publishing**: All chapters private by default (owner-only access)

## Required Vercel Environment Variables

You must add these three environment variables in your Vercel project settings:

### 1. MEMOIR_ENCRYPTION_KEY

The AES-256 encryption key used to decrypt the memoir content.

**Value**: (see `content/memoir/key.txt` - DO NOT commit this file)

```
nf2ZyKACsga0bWhHvH7yDcW5JVad1cy6h+Au2F8tYLE=
```

### 2. MEMOIR_PASSWORD

The password required to access the memoir. Choose a strong password.

**Example**: `YourSecurePasswordHere123!`

### 3. MEMOIR_JWT_SECRET

Secret key for signing JWT session tokens. Must be at least 32 characters.

**Example**: `your-secure-jwt-secret-key-at-least-32-characters-long`

## Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project (ilakk-manoharan.vercel.app)
3. Go to Settings → Environment Variables
4. Add each of the three variables above:
   - Name: `MEMOIR_ENCRYPTION_KEY`
   - Value: (paste the key from above)
   - Environment: Production, Preview, Development (select all)
5. Repeat for `MEMOIR_PASSWORD` and `MEMOIR_JWT_SECRET`
6. Redeploy the application

## Content Structure

The memoir includes:
- **Prologue**: Me as a Baby, Smiling (1 post)
- **Chapter 1**: A Dream From My Childhood (25 posts)
- **Chapter 2**: Married at 26 (14 posts)
- **Chapter 3**: Hired a Dozen Times, Fired a Dozen Times (47 posts)
- **Chapter 4**: Best Valentine's Day Ever (39 posts)
- **Chapter 5**: The Dissolution Doc (38 posts)
- **Chapter 6**: Pushed Out of My Home (11 posts)
- **Chapter 7**: Homeless With a Green Card (43 posts)
- **Chapter 8**: My Son (23 posts)
- **Chapter 9**: Tragic Pain (64 posts)
- **Chapter 10**: Learning to Exist in Public (24 posts)
- **Chapter 11**: Why Am I Not Enough? (20 posts)
- **Chapter 12**: Prayers, Poems, and Machines (28 posts)
- **Chapter 13**: Slow Progress (36 posts)
- **Chapter 14**: Why I'm Writing This (7 posts)

**Total**: 15 chapters (including prologue), 420 posts

## Privacy Features

✅ **Encrypted storage** - Content encrypted at rest in the git repository
✅ **Server-side decryption** - Content never sent to client until authenticated
✅ **Password authentication** - HttpOnly session cookies prevent XSS attacks
✅ **No indexing** - robots.txt and meta tags prevent search engine indexing
✅ **No public access** - All memoir routes require authentication

## Verification

After deployment, verify privacy with:

```bash
# Should return login page only, no memoir content
curl https://ilakk-manoharan.vercel.app/memoir

# Should show robots disallow
curl https://ilakk-manoharan.vercel.app/robots.txt
```

## Pages

- `/memoir` - Login page (public) or cover page (authenticated)
- `/memoir/toc` - Table of contents (authenticated only)
- `/memoir/chapter/[number]` - Chapter reader (authenticated only)

## Notes

- The encryption key file (`content/memoir/key.txt`) is gitignored and should never be committed
- Excluded content: Posts mentioning "Bank of America" or "rajesh gensol/Generic Solutions Inc"
- Photos are noted as placeholders (actual images not included in this implementation)
- All content is kept exactly as written by Ilak, with no rewording or editing
