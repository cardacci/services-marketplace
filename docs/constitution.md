# Constitution

- **Version:** 1.0.0
- **Ratified:** 2026-10-09
- **Last amended:** 2026-10-09

The non-negotiable principles of this project. Every spec, plan and change must comply with them. When another document contradicts this one, **this one wins** until it is amended.

Conventions (naming, folder structure, tools) live in `docs/architecture/` and can change freely. Principles here change only through the amendment process below.

## Principles

### I. Spec first

No feature code without an `Approved` spec and plan in `docs/specs/`. If implementation reveals the spec is wrong, the spec is changed first, then the code.

### II. One contract, shared

Validation schemas and API types are defined once, with Zod, in `@sm/shared`, and used by both web and api. The frontend never redefines an API type; the API never accepts input that hasn't passed a shared schema.

### III. The backend enforces the rules

Business rules (`BR-*`) are enforced in API services and, where possible, by database constraints. The frontend may repeat validations for user experience but is never trusted.

### IV. Business rules are tested

Every business rule has at least one automated test named after its ID. Every endpoint has tests for its success path and its authorization. Geospatial and database behavior is tested against a real PostgreSQL + PostGIS, never mocked. A PR that breaks a test is not merged.

### V. History is never lost

Appointments and reviews are never deleted, and deleting a user or an address never breaks them (soft delete). Migrations are forward-only: once merged, a migration is never edited.

### VI. Secure and private by default

- No secrets in the repository.
- Session tokens only in httpOnly cookies.
- Authorization is checked per resource (being a participant of an appointment), not only per login.
- Personal data (phone, address, exact location) is exposed only to who needs it, when they need it.

### VII. Simplicity first

Modular monolith, no microservices. A new dependency, tool or infrastructure piece needs a reason written in the plan, and an ADR if it is significant. Build what the current specs need, not what the future might need.

### VIII. Zero cost until there are users

Everything must run on free tiers. Any change that adds a recurring cost requires an ADR and the project owners' agreement.

### IX. Docs travel with code

A PR that changes behavior, data model or conventions updates the affected docs in the same PR. Significant decisions are recorded as ADRs.

## Governance

- **Amendments** are made by PR that changes this file, explains why, and bumps the version:
  - **MAJOR** — a principle is removed or redefined.
  - **MINOR** — a principle is added or materially expanded.
  - **PATCH** — wording clarifications.
- Every `plan.md` includes a **Constitution check**: each principle is marked as complying, or the deviation is justified. An unjustified deviation blocks approval.
- Reviews (human or AI) check compliance with this document before anything else.
