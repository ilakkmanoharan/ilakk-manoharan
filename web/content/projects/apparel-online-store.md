---
slug: apparel-online-store
title: Apparel Online Store
description: "Multilingual fashion e-commerce: catalog and search, cart and Stripe checkout, accounts, loyalty, promos, gift cards, returns, BOPIS, and an admin area for products, orders, campaigns, and analytics."
role: "Solo builder — Next.js monolith, Firebase, Stripe, and locale-driven shopper + admin UX"
status: Shipped
featured: false
githubUrl: ""
websiteUrl: ""
demoVideoUrl: ""
caseStudyUrl: ""
filterTags: '["Full Stack","Cloud"]'
techStack: '["Next.js 14","React 18","TypeScript","Tailwind CSS","Framer Motion","Radix UI","Zustand","Firebase","Stripe"]'
---

**Apparel Online Store** is a multilingual fashion e-commerce app: catalog and search, cart and Stripe checkout, accounts, loyalty, promos, gift cards, returns, BOPIS, and an **admin** area for products, orders, campaigns, and analytics.

**Stack:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Framer Motion, Radix / Headless UI, Zustand; **Firebase** (Firestore, Auth, Storage; Admin SDK in APIs); **Stripe** (checkout, webhooks, refunds, portal).

**Architecture:** One deployable Next.js monolith—`/[locale]` shopper routes with middleware-driven locales, separate `/admin`, and `app/api` handlers for payments and server-only work; the browser talks to Firestore where rules allow; secrets stay on the server.
