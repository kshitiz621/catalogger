# Launch Audit

Catalogger launch-readiness checklist and Lighthouse improvement notes.

## SEO

| Item | Status | Location |
|------|--------|----------|
| `metadataBase` + canonical URLs | Done | `src/lib/seo/metadata.ts` |
| Dynamic sitemap | Done | `src/app/sitemap.ts` |
| robots.txt | Done | `src/app/robots.ts` |
| Open Graph images | Done | `src/app/opengraph-image.tsx` |
| Store/product metadata | Done | `src/lib/seo/store-metadata.ts` |
| Private routes noindex | Done | Dashboard, platform, cart, checkout |
| Web manifest | Done | `src/app/manifest.ts` |

**Action:** Set `NEXT_PUBLIC_APP_URL` in production.

## Performance

| Item | Status | Notes |
|------|--------|-------|
| `next/image` on storefront | Done | `src/components/ui/optimized-image.tsx` |
| AVIF/WebP formats | Done | `next.config.ts` |
| ISR on store pages | Done | `revalidate = 60` |
| Font optimization (app) | Done | `next/font` Inter |
| Store custom fonts | Partial | Runtime Google Fonts link in storefront |

**Lighthouse tips:**

- Set real upload CDN domains in `images.remotePatterns`
- Use `priority` on above-the-fold images (banner, product hero)
- Keep storefront JS client-only where needed; server-render catalogue data

## Accessibility

| Item | Status |
|------|--------|
| Alt text on product/store images | Done |
| `aria-label` on icon buttons | Existing on cart/add actions |
| Semantic headings on storefront | Existing |
| Focus states via Tailwind | Existing |
| `lang="en"` on html | Done |

**Follow-up:** Audit color contrast per store theme color.

## Security

| Item | Status | Location |
|------|--------|----------|
| Security headers (HSTS, X-Frame-Options, etc.) | Done | `src/lib/security/headers.ts` |
| Rate limiting (auth, slug check, public API) | Done | `src/middleware.ts` |
| Registration/maintenance guards | Done | `src/lib/security/platform-guard.ts` |
| Suspended store/user hidden from public | Done | `public-store.service.ts` |
| Zod validation on auth APIs | Done | `src/lib/schema.ts` |
| `poweredByHeader: false` | Done | `next.config.ts` |

**Follow-up:**

- Add CSP when custom `headerCode`/`footerCode` usage is reviewed
- Replace mock upload provider in production
- Consider WAF / Vercel Firewall for DDoS

## Validation

- Central Zod schemas: `src/lib/schema.ts`
- API helpers: `src/lib/api/handler.ts`
- Legacy login + change password schemas added

## Error & loading states

| Route | error | not-found | loading |
|-------|-------|-----------|---------|
| Root | Yes | Yes | Yes |
| Dashboard | Yes | Yes | Yes |
| Platform | Yes | Yes | Yes |
| Store | Yes | Yes | Yes |
| Global crash | Yes (`global-error.tsx`) | — | — |

## Monitoring

- `GET /api/health` — DB connectivity + latency
- Structured logger — `src/lib/monitoring/logger.ts`

## Modular architecture

```
src/lib/seo/          Metadata, sitemap data
src/lib/security/     Headers, rate limits, platform guards
src/lib/api/          JSON responses, session helpers
src/lib/monitoring/   Health + logging
src/lib/images/       Remote image allowlist
src/components/errors/ Reusable error/404 screens
```

## Lighthouse target workflow

1. Run production build: `npm run build && npm start`
2. Audit `/`, `/store/[slug]`, `/store/[slug]/product/[id]`
3. Verify Performance (images, caching), SEO (metadata, robots), Accessibility, Best Practices (headers)

Expected improvements from this pass: SEO 90+, Best Practices 90+, Performance uplift on storefront image-heavy pages.
