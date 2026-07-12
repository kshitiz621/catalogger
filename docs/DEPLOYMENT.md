# Deployment Guide

## Prerequisites

- Neon project with PostgreSQL database
- Neon Auth enabled on the same project
- Node.js 20+
- Vercel account (recommended) or any Node.js host

## 1. Database

1. Create a Neon project and copy connection strings.
2. Set `DATABASE_URL` (pooled) and `DATABASE_URL_UNPOOLED` (direct) in production env.
3. Migrations run automatically via `npm run build` (`prisma migrate deploy`).

## 2. Authentication

1. Enable Neon Auth in the Neon console.
2. Set `NEON_AUTH_BASE_URL` and `NEON_AUTH_COOKIE_SECRET` (32+ chars).
3. Add production URL to Neon Auth allowed redirect origins.

## 3. App URL

Set `NEXT_PUBLIC_APP_URL` to your canonical domain, e.g. `https://catalogger.com`.

This powers:

- `metadataBase` and canonical URLs
- `/sitemap.xml`
- Open Graph image URLs
- `robots.txt` host

## 4. Vercel deployment

```bash
vercel link
vercel env pull .env.local
# Verify env vars in Vercel dashboard
vercel --prod
```

Build command: `npm run build`  
Output: Next.js default

## 5. Post-deploy checks

- [ ] `GET /api/health` returns `{ "status": "ok" }`
- [ ] `/robots.txt` and `/sitemap.xml` load
- [ ] `/opengraph-image` returns PNG
- [ ] Seller signup and login work
- [ ] Public store `/store/[slug]` loads
- [ ] Dashboard and platform routes require auth

## 6. Maintenance mode

**Env override (instant):** `MAINTENANCE_MODE=true`  
Rewrites public traffic to `/maintenance`. Platform admin and health check remain available.

**Database flag:** `PlatformSettings.maintenanceMode` — enforced on signup routes.

## 7. Monitoring

- Health endpoint: `/api/health` (database latency + status)
- Structured logs via `src/lib/monitoring/logger.ts`
- Connect Vercel Analytics / Sentry as needed

## 8. Uploads (production)

Set `NEXT_PUBLIC_UPLOAD_PROVIDER` to `cloudinary` or `s3` — do not use `mock` in production.

Add image hostnames to `NEXT_PUBLIC_IMAGE_HOSTS` or `next.config.ts` `images.remotePatterns` for `next/image` optimization.
