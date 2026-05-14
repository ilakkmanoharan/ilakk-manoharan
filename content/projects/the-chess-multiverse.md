---
slug: the-chess-multiverse
title: The Chess Multiverse
description: "Multiplayer web chess on an infinite 2D grid of linked 8×8 boards—edge rules move play across boards. Monorepo: Express + WebSocket server (authoritative), Vite + React + PixiJS client, shared TypeScript rules engine."
role: "Creator — game design, real-time server, PixiJS rendering, and Firebase Auth for lobby"
status: Active
featured: true
githubUrl: ""
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
filterTags: '["Full Stack","Backend","Distributed Systems"]'
techStack: '["React","TypeScript","Vite","PixiJS","Zustand","Tailwind CSS","Node.js","Express","WebSocket","Firebase Auth","Vitest"]'
---

The Chess Multiverse is multiplayer web chess on an infinite 2D grid of linked 8×8 boards.

Edge rules (e.g. queen exit) trigger moves to neighboring boards so play spans many boards, not one isolated surface.

Monorepo (npm workspaces): `packages/shared` = pure TypeScript chess + board math + socket types used everywhere.

`apps/server` = Node + Express + WebSocket (`ws`); authoritative in-memory world; validates/applies moves via `shared`; broadcasts `game_state`, `move_applied`, `board_transition`.
`apps/web` = Vite + React; PixiJS renders the multi-board world, pan/zoom, and pieces; Zustand mirrors game/session/WS; Tailwind for UI chrome.

Flow: client opens WS → `join` → server pushes state; every move is validated server-side; Firebase Auth protects lobby and game routes.
Web stack: React 18, react-router-dom 6, PixiJS 7, Zustand 4, Tailwind 3, Firebase JS SDK, Vitest.

Server stack: Node ≥18, Express 4, firebase-admin (optional), tsx in dev, Vitest.

Dev: `npm run dev`; build: shared → server → web; env vars configure WS URL and Firebase.

Roadmap: persistence and real lobby data, stronger neighbor AI, optional “by piece” mode—the core sign-in, join, and real-time play loop is live today.
Positioning: classical chess rules with spatial multiverse exploration—browser-first, real-time, server-authoritative play.
