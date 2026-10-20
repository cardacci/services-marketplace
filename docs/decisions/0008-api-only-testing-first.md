# 0008. Test the API only, with Jest + Supertest, at first

- **Status:** Accepted; test runner superseded by [0011](0011-vitest-test-runner.md) (Vitest instead of Jest)
- **Date:** 2026-10-17

## Context

The business rules, which are the riskiest part of the product, live in the API and are enforced there and in the database; the frontend repeats validations only for user experience and is never trusted. At this early stage the UI changes often, so frontend and browser tests would need constant rewriting while protecting little. Setting up a full testing toolbox (Jest, Supertest, Testcontainers, Vitest, Testing Library, Playwright) now would cost more than it returns.

## Decision

- **Jest** for unit tests of API services and business rules (NestJS default).
- **Supertest** inside Jest for endpoint (e2e) tests; NestJS generates this setup.
- e2e tests run against a dedicated test database in the local `docker-compose` Postgres + PostGIS (and a Postgres service container in CI).
- No frontend tests and no browser E2E tests for now.

## Alternatives considered

- **Testcontainers** — isolated databases per test run, but more setup; docker-compose is enough at this size.
- **Jest in the frontend** — needs extra configuration with Vite (TypeScript and ESM transforms).

## Consequences

- When frontend tests are added, use **Vitest** (same API as Jest, native to Vite) with **Testing Library**, in a new ADR.
- Browser E2E (Playwright) is reconsidered once the main flows exist.
- Frontend regressions are caught by typecheck, lint and manual testing until then.
