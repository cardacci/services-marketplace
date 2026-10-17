# 0010. Image storage on Cloudflare R2, compressed in the browser

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

Users upload a profile photo (`FR-AUTH-03`, `FR-SET-01`), up to 3 images per appointment and up to 3 per review (`BR-07`). Most come from phone cameras (3–5 MB each), and appointment photos often show the inside of a home, so they must be private (principle VI). Storage must be free (principle VIII). The images only need enough detail to understand the problem or recognize a person.

## Decision

- Store images in a **private Cloudflare R2 bucket**. Nothing is publicly listable or readable.
- **Uploads:** the browser asks the API for a presigned `PUT` URL, then uploads directly to R2. The API signs only after checking that the user may attach an image to that resource, and binds the declared content type and size to the signature.
- **Reads:** the API returns short-lived presigned `GET` URLs, only to users allowed to see the image (e.g. the two participants of an appointment).
- **Compression in the browser before upload:** resize so the longest side is at most 1600 px (512 px for profile photos) and re-encode as WebP (JPEG fallback) at ~0.8 quality. A typical result is 150–400 KB.
- The API rejects uploads larger than 1 MB or with a type other than WebP/JPEG, so the limit holds even if a client skips compression (principle III).
- Initial values (sizes, quality, limit) can be tuned in the plan of the feature that implements uploads.

## Alternatives considered

- **Cloudinary** — no card needed and it resizes on the fly, but its 25 monthly credits are shared between storage, bandwidth and transformations, private delivery on the free plan must be verified, its API is proprietary and local development needs a real account. With compression done in the browser, its main advantage disappears.
- **Storing images in PostgreSQL** — uses Neon's 0.5 GB quickly and makes the database heavier to back up and query.

## Consequences

- Free tier: 10 GB storage, 1M writes and 10M reads per month, free egress. At ~300 KB per image that is about 30,000 images.
- Re-encoding in a canvas drops EXIF metadata, including the GPS location many phones add to photos.
- No server-side thumbnails: one size per image. If lists ever need smaller versions, the browser can upload a second variant.
- The S3-compatible API allows running MinIO in `docker compose` for local development and switching providers without code changes. Tests use a fake storage (`testing-strategy.md`).
- Signed `GET` URLs change on every request, which limits browser caching; signing with fixed expiry windows reduces that if it becomes a problem.
- Enabling R2 may require adding a payment method to the Cloudflare account, even on the free tier.
