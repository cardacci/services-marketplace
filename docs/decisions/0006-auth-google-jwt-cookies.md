# 0006. Google OAuth with JWT in httpOnly cookies

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

Users should sign in quickly without creating a password. The frontend and API are on different domains.

## Decision

- Google OAuth through Passport (`passport-google-oauth20`) in the API.
- The API issues a short-lived access JWT and a longer refresh JWT, both in **httpOnly, Secure** cookies (`SameSite` configured for the cross-domain setup).
- Refresh tokens are rotated on use.
- `users.google_id` is nullable so other login methods can be added later.

## Alternatives considered

- **Tokens in localStorage** — exposed to XSS.
- **Auth-as-a-service (Clerk, Auth0, Supabase Auth)** — less to build, but pricing grows with monthly active users, user data and sessions live in an external provider, and the same session must also authenticate the WebSocket connection, which a provider adds another integration layer to. With Google as the only login method, the in-house scope stays small.

## Consequences

- CORS must allow credentials from the web origin only.
- Cross-site cookies need `SameSite=None; Secure`; a custom domain shared by web and api would allow `SameSite=Lax`.
- The WebSocket handshake authenticates with the same cookie.
