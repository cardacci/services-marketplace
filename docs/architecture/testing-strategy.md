# Testing strategy

Scope for now: **API only**, with Jest + Supertest ([ADR 0008](../decisions/0008-api-only-testing-first.md)).

## Levels

| Level | Tool | Scope | Where |
|---|---|---|---|
| Unit (api) | Jest | Services and business rules with mocked dependencies | `*.service.spec.ts` next to the code |
| e2e (api) | Jest + Supertest | HTTP endpoint → service → real Postgres + PostGIS (test database) | `apps/api/test/*.e2e-spec.ts` |

### Later

| Level | Tool | When |
|---|---|---|
| Frontend components / hooks | Vitest + Testing Library | When the UI has non-trivial logic worth testing |
| Browser E2E | Playwright | When the main flows (search → appointment → chat → review) exist |

## What must be tested

- Every business rule (`BR-*`) has at least one unit test. Name tests after the rule: `it('BR-03: cannot accept a cancelled appointment')`.
- Every endpoint has at least one e2e test for the success path and one for authorization (`NFR-08`).
- Acceptance criteria in a `spec.md` map to tests; the plan says which test covers each one.
- Geospatial queries are tested against the real PostGIS database, never mocked.

## Test database

- Local: a separate database (`services_marketplace_test`) in the same `docker-compose` Postgres + PostGIS container, created by `docker/postgres-init/20-create-test-db.sql` on the first start and configured through `apps/api/.env.test` (keys in `.env.test.example`). Each database has its own tables and data, so truncating test tables never touches development data.
- CI: a `postgis/postgis` service container in the GitHub Actions job.
- Migrations are applied before the e2e suite; tables are truncated between test files.

## Practices

- Arrange / Act / Assert; one behavior per test.
- Test data through small factories (`buildUser()`, `buildAppointment()`), not shared fixtures.
- No calls to real external services in tests (Google, Georef, image storage): use fakes.

## CI

Unit and e2e tests run on every PR.
