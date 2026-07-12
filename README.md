# Catalogger

Modern product catalogue platform for small businesses. Sellers create WhatsApp-ready online stores; customers browse and order without friction.

## Stack

- **Next.js 16** (App Router)
- **PostgreSQL** via Prisma (Neon)
- **Neon Auth** for authentication
- **Tailwind CSS 4** + shadcn/ui

## Quick start

```bash
cp .env.example .env
# Fill in DATABASE_URL, NEON_AUTH_* from Neon dashboard

npm install
npx prisma migrate deploy
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Migrate + production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## Project structure

```
src/
  app/              # Routes (storefront, dashboard, platform, API)
  components/       # UI + feature components
  lib/
    seo/            # Metadata, sitemap helpers
    security/       # Headers, rate limits, platform guards
    api/            # API response helpers
    monitoring/     # Health checks, structured logging
    services/       # Business logic (stores, analytics, signup)
  types/            # Shared TypeScript types
```

## Environment

See `.env.example` for required variables. Set `NEXT_PUBLIC_APP_URL` in production for correct SEO canonical URLs, sitemap, and Open Graph images.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Neon, Vercel, and launch checklist.

## Launch audit

See [docs/LAUNCH-AUDIT.md](docs/LAUNCH-AUDIT.md) for SEO, performance, security, and Lighthouse notes.
