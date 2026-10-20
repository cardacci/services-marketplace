# 0002. NestJS, Prisma and PostgreSQL + PostGIS

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

The marketplace connects clients with nearby professionals, so finding professionals by distance is a core product feature, not an add-on. The domain is strongly relational (users, professionals, categories, properties, appointments, reviews, conversations) with integrity rules that should hold at the database level wherever possible, such as a client never booking themselves and one review per participant per appointment. The backend needs clear domain boundaries that a small team can evolve without the operational cost of distributed services, and a single language across web and API lets validation schemas and types be shared end to end.

## Decision

- **NestJS** as a modular monolith: one module per domain.
- **PostgreSQL** with the **PostGIS** extension for geospatial queries.
- **Prisma** as ORM and migration tool. Geospatial columns are declared as `Unsupported("geography(Point, 4326)")` and queried with `$queryRaw` / `$executeRaw`.

## Alternatives considered

- **Drizzle** — closer to SQL and handles advanced queries well, but its migration tooling and ecosystem are less mature, and the schema-first workflow of Prisma keeps the data model easier to read and review.
- **TypeORM** — Nest's historical default, weaker typing and migrations.
- **Express/Fastify without a framework** — lighter, but module boundaries, dependency injection and cross-cutting concerns (validation, guards, error handling) would have to be built and kept consistent by hand.
- **Microservices** — premature for the size and team.

## Consequences

- Strong typing end to end; migrations versioned in the repo.
- Geo queries live in raw SQL inside a repository-like service, covered by integration tests against real PostGIS.
- Some constraints (CHECK, GIST, partial indexes) are written by hand in migrations.
