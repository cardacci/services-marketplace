# Architecture Decision Records

One file per significant decision. Accepted ADRs are not edited (except typos or status); a change of mind is a **new** ADR that supersedes the old one.

| # | Decision | Status |
|---|---|---|
| [0001](0001-monorepo-pnpm-turborepo.md) | Monorepo with pnpm workspaces and Turborepo | Accepted |
| [0002](0002-nestjs-prisma-postgresql.md) | NestJS, Prisma and PostgreSQL + PostGIS | Accepted |
| [0003](0003-shared-zod-validation.md) | Zod schemas shared between web and api | Accepted |
| [0004](0004-tanstack-query-zustand.md) | TanStack Query + Zustand | Accepted |
| [0005](0005-free-tier-hosting.md) | Free-tier hosting: Render and Neon | Accepted |
| [0006](0006-auth-google-jwt-cookies.md) | Google OAuth with JWT in httpOnly cookies | Accepted |
| [0007](0007-single-users-table.md) | Single users table with optional professional profile | Accepted |
| [0008](0008-api-only-testing-first.md) | Test the API only, with Jest + Supertest, at first | Accepted |

New ADR: copy [`template.md`](template.md) with the next number.
