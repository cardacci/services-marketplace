# 0004. TanStack Query + Zustand

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

Most state in this app is server data (professionals, appointments, messages). Little state is purely client-side (session, active mode, UI). The main problems to solve are caching, background refetching, pagination and keeping lists fresh after mutations, not complex client-side state transitions.

## Decision

- **TanStack Query** for all server state: caching, refetching, pagination, optimistic updates.
- **Zustand** for the small amount of global client state.
- Filters live in the URL (search params).

## Alternatives considered

- **Redux Toolkit + RTK Query** — capable and covers both kinds of state, but adds slices, actions and store setup for a client state that is only a few values, and RTK Query offers no clear advantage over TanStack Query for this mostly server-driven app.

## Consequences

- Less code and no manual cache handling.
- Server data must never be duplicated in Zustand.
