# 0003. Zod schemas shared between web and api

- **Status:** Accepted
- **Date:** 2026-10-17

## Context

The same data (onboarding, appointment request, review) is validated in a form and in the API. Keeping two definitions in sync is error-prone.

## Decision

Zod schemas live in `@sm/shared`. The API turns them into DTOs with `nestjs-zod` and validates with a global `ZodValidationPipe`; the web uses them with React Hook Form's `zodResolver`. Types are inferred with `z.infer`. Swagger documentation is generated from the same DTOs.

## Alternatives considered

- **class-validator + class-transformer** — Nest's default, but not usable in the frontend.
- **Generating a client from OpenAPI** — useful later; it doesn't cover form validation.

## Consequences

- One change in a schema updates validation and types on both sides.
- Error messages from schemas are technical; the UI maps them to Spanish copy.
