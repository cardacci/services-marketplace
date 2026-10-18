# 000. Monorepo setup — Spec

- **Status:** Draft
- **Requirements:** NFR-07, NFR-09
- **Related:** [ADR 0001](../../decisions/0001-monorepo-pnpm-turborepo.md), [overview](../../architecture/overview.md)

## Summary

Create the project foundation: a pnpm + Turborepo monorepo with the API, the web app and a shared package wired together, a local database, and code-quality tooling.

## Motivation

Every feature depends on this structure. Validating early that `@sm/shared` is consumed correctly by both NestJS (CommonJS) and Vite avoids painful changes later.

## User stories

- As the **developer**, I want to start every app with one command, so that local development is fast.
- As the **developer**, I want shared schemas and types imported by web and api, so that contracts never drift.
- As the **developer**, I want a local Postgres with PostGIS, so that I develop against the same engine as production.
- As the **developer**, I want lint, format and commit checks to run automatically, so that the codebase stays consistent.

## Acceptance criteria

- **AC-1** — Given a fresh clone, when I run `pnpm install` and `pnpm dev`, then the API answers on `http://localhost:3000` and the web app on `http://localhost:5173`.
- **AC-2** — Given a constant exported from `@sm/shared`, when it is imported in both `apps/api` and `apps/web`, then both compile and show its value at runtime.
- **AC-3** — Given `docker compose up -d` on a fresh volume, when I run `SELECT postgis_version();` against the development database (`services_marketplace`) and the test database (`services_marketplace_test`), then both return a version.
- **AC-4** — When I run `pnpm lint`, `pnpm typecheck`, `pnpm test` and `pnpm build` from the root, then they run across all packages and pass.
- **AC-5** — Given a commit message that does not follow Conventional Commits, when I commit, then the commit is rejected.
- **AC-6** — Given staged files with formatting issues, when I commit, then they are formatted/linted automatically.
- **AC-7** — Given the web app, when it renders, then Tailwind classes apply and at least one shadcn/ui component (`Button`) is available.
- **AC-8** — The repository contains `.env.example` files and no real secrets; `.nvmrc` pins the Node version.

## Out of scope

- Prisma and the database schema (spec 002).
- CI/CD and deployment (spec 001).
- Any product feature.

## Open questions

None for now.
