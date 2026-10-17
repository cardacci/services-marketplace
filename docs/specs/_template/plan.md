# NNN. Feature name — Plan

- **Status:** Draft
- **Spec:** [spec.md](spec.md)

## Constitution check

| Principle | Complies? | Notes / justified deviation |
|---|---|---|
| I. Spec first | ✅ | |
| II. One contract, shared | | |
| III. The backend enforces the rules | | |
| IV. Business rules are tested | | |
| V. History is never lost | | |
| VI. Secure and private by default | | |
| VII. Simplicity first | | |
| VIII. Zero cost until there are users | | |
| IX. Docs travel with code | | |

## Approach

Short description of the technical solution.

## Data model

Tables, columns, constraints, indexes and migrations added or changed. Update `docs/architecture/database.md`.

## Shared (`@sm/shared`)

Zod schemas, types, enums and error codes added.

## API

| Method | Path | Auth / guard | Request | Response | Errors |
|---|---|---|---|---|---|
| | | | | | |

Module(s), services and guards involved.

## Web

Routes, pages, components, query/mutation hooks, stores.

## Testing

Levels: `unit (api)`, `e2e (api)` or `manual`. Only the backend has automated tests for now (ADR 0008), so web behavior is verified manually.

| Acceptance criterion / rule | Test level | Test |
|---|---|---|
| AC-1 | e2e (api) | `appointments.e2e-spec.ts › …` |
| AC-2 | manual | Steps to verify in the browser |
| BR-NN | unit (api) | `appointments.service.spec.ts › 'BR-NN: …'` |

## Risks and alternatives

What could go wrong; alternatives discarded and why. New ADR needed?

## Open questions

- [ ] …
