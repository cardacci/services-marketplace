# 0007. Single users table with optional professional profile

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

Early sketches had separate `Tenant` and `Professional` entities. A person may both hire and offer services, and clients are not always tenants.

## Decision

- All people are rows in `users`.
- A `professional_profiles` row (PK = `user_id`) makes a user a professional.
- Permissions depend on the relation to each resource (client or professional of an appointment), not on a global role.
- "Tenant" is renamed **client**.

## Alternatives considered

- **Separate client and professional tables** — duplicated data and no way to be both.
- **A `role` column** — doesn't support being both at once.

## Consequences

- `BR-02` (no appointment with oneself) is enforced with a CHECK constraint.
- The UI needs a mode switch for users who are both (designed later).
