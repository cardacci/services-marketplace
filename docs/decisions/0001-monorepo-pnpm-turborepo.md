# 0001. Monorepo with pnpm workspaces and Turborepo

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

The project has a React frontend and a NestJS backend that need the same types and validation schemas. Most features cross both sides (a new field touches the schema, the endpoint and the form), so they should change, be reviewed and ship together without publishing packages between repositories.

## Decision

A single repository with pnpm workspaces and Turborepo:

- `apps/api`, `apps/web`, `packages/config`, `packages/shared`.
- Internal packages use the `@sm/` scope.
- `packages/shared` is built with tsup (CJS + ESM + types) so both Nest (CommonJS) and Vite can consume it.

## Alternatives considered

- **Two repositories** — duplicated types and harder coordinated changes.
- **Nx** — more powerful (generators, dependency graph rules), but adds its own configuration and plugin layer that two apps and two packages don't need; Turborepo only adds caching and task ordering on top of pnpm workspaces.
- **npm/yarn workspaces** — pnpm is faster, stricter with dependencies and widely used.

## Consequences

- One PR can change API, shared schemas and UI together.
- CI must only build and deploy what changed (Turborepo filters, path-based deploy).
- Shared package must be built before apps (`dependsOn: ["^build"]`).
