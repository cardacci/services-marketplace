# 0001. Monorepo with pnpm workspaces and Turborepo

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

The project has a React frontend and a NestJS backend developed by one person. Both need the same types and validation schemas, and the developer wants frontend and backend in one repository.

## Decision

A single repository with pnpm workspaces and Turborepo:

- `apps/api`, `apps/web`, `packages/config`, `packages/shared`.
- Internal packages use the `@sm/` scope.
- `packages/shared` is built with tsup (CJS + ESM + types) so both Nest (CommonJS) and Vite can consume it.

## Alternatives considered

- **Two repositories** — duplicated types and harder coordinated changes.
- **Nx** — more powerful but heavier to learn and configure for a project this size.
- **npm/yarn workspaces** — pnpm is faster, stricter with dependencies and widely used.

## Consequences

- One PR can change API, shared schemas and UI together.
- CI must only build and deploy what changed (Turborepo filters, path-based deploy).
- Shared package must be built before apps (`dependsOn: ["^build"]`).
