# Portfolio site (spec1)

Next.js 16 app for **Ilak Manoharan** — home, projects, startups, hackathons, Founder Studio, skills, recruiter portal, scheduling, contact, admin dashboard, and APIs for forms plus a daily summary cron.

## Prerequisites

- Node.js 22+
- npm

## Setup

```bash
npm install
cp .env.example .env
```

Edit `.env`:

- `DATABASE_URL` — default `file:./dev.db` (SQLite via better-sqlite3 adapter).
- `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` — required for `/admin` (use a long random secret).
- Optional: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DAILY_SUMMARY_TO_EMAIL` for daily email.
- Optional: `CRON_SECRET` — protect `GET /api/cron/daily-summary` (send `Authorization: Bearer <CRON_SECRET>`).
- Optional: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_INTRO_VIDEO_ID`, `NEXT_PUBLIC_CAL_EMBED_URL`, `NEXT_PUBLIC_RESUME_URL`.

Apply schema and seed demo content:

```bash
npx prisma migrate dev
npx prisma db seed
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production notes

- Run `prisma generate` on deploy (handled by `postinstall` / `build` script).
- Move `DATABASE_URL` to PostgreSQL when ready; keep using the Prisma adapter pattern for your provider.
- Configure Vercel Cron (or another scheduler) to hit `/api/cron/daily-summary` daily with the bearer token.
- Next.js 16 may deprecate `middleware.ts` in favor of `proxy`; follow upstream guidance when upgrading.

## Content

- Public recruiter Q&A for the bot: `public/recruiter-data/recruiter-qa.md`.
- Seed / CMS data: `prisma/seed.ts` (edit and re-run `npx prisma db seed`).
