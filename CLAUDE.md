# CLAUDE.md

Guidance for Claude (and any AI assistant) working in this repository.

## Project

Services marketplace: clients find nearby professionals (plumbers, gas fitters, electricians…), book appointments, chat and leave two-way reviews. Personal full-stack project; the product idea belongs to a partner, implementation is done here.

- **Constitution (non-negotiable principles, read first):** `docs/constitution.md`
- Product context: `docs/product/vision.md`
- Requirements (with IDs): `docs/product/requirements.md`
- Architecture: `docs/architecture/overview.md`
- Data model: `docs/architecture/database.md`

## Workflow: Spec-Driven Development (SDD)

Code is written **from specs, never ahead of them**. Each feature lives in `docs/specs/NNN-feature-name/`:

1. `spec.md` — **what and why**: user stories, acceptance criteria, business rules, out of scope. No implementation details.
2. `plan.md` — **how**: data model changes, endpoints, modules, components, risks.
3. `tasks.md` — ordered checklist of small, testable tasks derived from the plan.

Rules (on top of `docs/constitution.md`, which always wins):

- Do not implement a feature whose `spec.md` and `plan.md` are not `Status: Approved`. If asked to, point it out and offer to help finish the spec first.
- Implement **one task at a time** from `tasks.md`, then tick it (`- [x]`). Do not jump ahead.
- If implementation reveals the spec or plan is wrong or incomplete, **stop and propose a change to the doc** before writing code that diverges from it.
- When code changes behavior, data model or conventions, update the affected docs in the same PR (`database.md`, `requirements.md`, ADRs…).
- Reference requirement IDs (`FR-APPT-03`, `BR-07`) in specs, plans, tests and PR descriptions.
- Significant technical decisions get an ADR in `docs/decisions/` (copy `template.md`). Never rewrite an accepted ADR — supersede it with a new one.
- Open questions go in the `Open questions` section of the relevant doc, not in code comments.

Custom commands in `.claude/commands/`: `/spec`, `/plan`, `/tasks`, `/implement`.

## Stack (summary)

- Monorepo: pnpm workspaces + Turborepo. `apps/web` (React + TS + Vite), `apps/api` (NestJS), `packages/shared` (Zod schemas, types, enums — package `@sm/shared`).
- Database: PostgreSQL + PostGIS via Prisma.
- Frontend state: TanStack Query for server state, Zustand for client state. No Redux.
- Styling: Tailwind CSS + shadcn/ui.
- Validation: Zod schemas in `@sm/shared`, used by both web forms and API pipes.
- Tests: Vitest + Supertest in `apps/api` only, for now. No frontend or browser E2E tests yet (see ADRs 0008 and 0011).
- Hosting: Render (web static site + API) and Neon (PostgreSQL).

## Conventions

- TypeScript strict everywhere. No `any` without a comment explaining why.
- Code, identifiers, commits and docs in **English**. UI copy in Spanish (Argentina).
- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`).
- Branches: `feature/*` → `develop` (squash merge) → `main` (merge commit, deploys).
- Never commit secrets. Environment variables are documented in `.env.example` files.
- Code style (formatting, alphabetical ordering, import groups): `docs/architecture/code-style.md`. API rules: `docs/architecture/api-conventions.md`. Frontend rules, including the component section order: `docs/architecture/frontend-conventions.md`.

## Commands

> To be completed when the monorepo is scaffolded (spec `000-monorepo-setup`).
