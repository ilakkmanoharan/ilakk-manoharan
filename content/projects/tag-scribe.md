---
slug: tag-scribe
title: Tag Scribe
description: "Productivity app for capture and recall—links, highlights, images, text, and video in a private library shaped with categories, tags, lists, and a yearly planner. Next.js API over Firestore; SwiftUI iOS and Kotlin Android clients."
role: "Solo builder — web API, Firebase auth, iOS Share Extension, and cross-platform contracts"
status: Active
featured: false
githubUrl: "https://github.com/ilakkmanoharan/tag-scribe"
websiteUrl: ""
appStoreUrl: "https://apps.apple.com/us/app/tagscribe/id6760214615"
demoVideoUrl: ""
caseStudyUrl: ""
filterTags: '["Full Stack","Mobile","Cloud"]'
techStack: '["Next.js 14","React","TypeScript","Vercel","Firestore","SQLite","Firebase Auth","SwiftUI","Kotlin","Jetpack Compose"]'
---

**Tag Scribe** is a productivity app for capture and recall: links, highlights, images, text, and video land in a private library you shape with categories, tags, lists, and an archive.

Optional due dates and priorities surface in a yearly planner so commitments stay visible beside everything you have saved to revisit.

A **Next.js 14** app on **Vercel** serves the **React** UI and `/api/*` REST layer over **Firestore** in production, or **SQLite** under `private/` when Firebase Admin is not in use.

The web signs in with **Firebase** (ID tokens on each request); **SwiftUI** on iOS uses **Sign in with Apple**, receives a server **JWT** in the Keychain and App Group, and ships a **Share Extension** so saves from other apps hit the same API; **Kotlin** and **Jetpack Compose** on Android are growing toward the same contract.

Github: https://github.com/ilakkmanoharan/tag-scribe

App Store: https://apps.apple.com/us/app/tagscribe/id6760214615
