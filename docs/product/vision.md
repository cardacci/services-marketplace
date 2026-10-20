# Product vision

## Problem

When something breaks at home, finding a trustworthy professional is slow and relies on word of mouth. Tenants are especially affected: they don't know local tradespeople and need someone available, nearby and reliable. Professionals, on the other hand, depend on referrals and have no simple way to show their reputation or manage their requests.

## Solution

A marketplace where a **client** searches for **professionals** by category, proximity and rating, requests an **appointment** with a description and photos of the problem, chats with the professional once the appointment is accepted, and both **review each other** after the job is done.

## Users

| Role | Description |
|---|---|
| Client | Anyone who needs a service: tenants first, also owners and businesses. Searches, books, chats and reviews. |
| Professional | Tradesperson offering one or more services. Manages availability, accepts or rejects appointments, chats and reviews clients. |

One account can be **both** client and professional (see `BR-01`). Switching between modes in the UI is designed later.

## Initial categories

Gas fitter (requires license), plumber, electrician, painter, carpenter, roofer. The model must allow adding any category later without code changes.

## Scope

### Phase 1 (MVP)

- Google sign-in and onboarding (client / professional).
- Professional profile, categories, weekly availability, license badge.
- Search with filters: category, rating, distance, name.
- Appointments: request, accept/reject, cancel, complete.
- Chat enabled by an accepted appointment.
- Two-way reviews after a completed appointment.
- In-app notifications.
- Favorites and account settings.

### Out of scope for Phase 1

- In-app payments (arranged outside the app, e.g. through chat).
- Email/password login.
- Native mobile apps (the web app must be responsive).
- Admin back office and manual license verification workflow.

### Future

- Payments (e.g. Mercado Pago) through a separate `payments` table.
- Availability exceptions (holidays, vacations).
- Email and push notifications.
- Expansion to services beyond home repairs.

## Success criteria

- Deployed and usable end to end on free hosting.

## Constraints

- Free hosting tiers only until the project has real users (`NFR-06`).
- Primary market: Argentina (Spanish UI, `America/Argentina/Buenos_Aires` timezone by default).

## Open questions

- Final product name (repo is `services-marketplace` for now). Candidates: Manito, Resolvé, Oficio, Cerca, Turno. Check domain, INPI trademark and app stores before deciding.
