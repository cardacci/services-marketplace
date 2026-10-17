# 0005. Free-tier hosting: Render and Neon

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

The project must run at no cost until it has real users, with as few platforms as possible to manage.

## Decision

- **Render** for both apps:
  - `apps/api` as a free **web service**.
  - `apps/web` as a **static site** (SPA with a rewrite of `/*` to `/index.html`).
- **Neon** free plan for PostgreSQL (supports PostGIS and database branches for develop/production).
- **Cloudflare R2 or Cloudinary** for images (to be decided).

## Alternatives considered

- **Everything on Render** — Render's free Postgres expires after 30 days.
- **Vercel for the web** — works well, but adds a third platform without a real benefit for a static SPA.
- **Oracle Cloud Always Free VM** (Docker Compose with API, Postgres and Nginx on one server) — always on and single platform, but requires managing the server (TLS, backups, updates, security). Reconsider if cold starts become a problem.
- **Koyeb** — no free plan for new accounts since February 2026.
- **Fly.io** — no free tier for new users.
- **Railway** — one-time trial credit only.
- **Supabase** — viable database alternative; Neon chosen for scale-to-zero and branching.

## Consequences

- The free API web service sleeps after ~15 minutes idle; the first request takes about a minute. Acceptable at the current, pre-launch traffic; moving to a paid instance removes it. Meanwhile the web should show a friendly loading state.
- Web and API live on different `onrender.com` subdomains, which browsers treat as different sites: auth cookies need `SameSite=None; Secure` and CORS with credentials (see ADR 0006). A custom domain later would allow `SameSite=Lax`.
- Neon free storage is 0.5 GB; images are never stored in the database.
- Free-tier limits change; review them before relying on them.
