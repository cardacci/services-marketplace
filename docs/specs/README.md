# Specs

One folder per feature, numbered in implementation order. Each folder goes through three documents:

| Document | Answers | Written when |
|---|---|---|
| `spec.md` | **What** and **why**: user stories, acceptance criteria, rules, out of scope | Before any technical design |
| `plan.md` | **How**: data, endpoints, modules, components, tests, risks | After the spec is approved |
| `tasks.md` | **In what order**: small, verifiable steps | After the plan is approved |

New feature: copy [`_template/`](_template/) to `NNN-feature-name/`.

## Workflow

```
spec.md (Draft) ──review──▶ Approved ──▶ plan.md (Draft) ──review──▶ Approved
   ──▶ tasks.md ──▶ implement task by task ──▶ PR ──▶ status: Implemented
```

With Claude Code: `/spec <feature>` → `/plan <NNN>` → `/tasks <NNN>` → `/implement <NNN>`.

## Roadmap

| # | Feature | Requirements | Spec | Plan | Tasks |
|---|---|---|---|---|---|
| [000](000-monorepo-setup/) | Monorepo setup | NFR-07, NFR-09 | Draft | Draft | 0/10 |
| 001 | CI/CD and first deploy | NFR-06, NFR-07 | — | — | — |
| 002 | Database schema, migrations and seed | NFR-04, BR-02, BR-11 | — | — | — |
| [003](003-auth-onboarding/) | Authentication and onboarding | FR-AUTH-01..05, FR-AUTH-07, FR-SET-03 (partial), BR-01, BR-05, BR-06, BR-10, NFR-03 | Draft | — | — |
| 004 | Professional profile and availability | FR-PROF-*, BR-05, BR-06, BR-10, BR-17 | — | — | — |
| 005 | Search and discovery | FR-SRCH-*, BR-17, NFR-04, NFR-05 | — | — | — |
| 006 | Appointments | FR-APPT-*, BR-02..04, BR-07, BR-13..15 | — | — | — |
| 007 | Chat | FR-CHAT-*, BR-09 | — | — | — |
| 008 | Reviews | FR-REV-*, BR-07, BR-08, BR-16 | — | — | — |
| 009 | Notifications | FR-NOTIF-01, FR-NOTIF-02 | — | — | — |
| 010 | Favorites and settings | FR-FAV-*, FR-SET-* | — | — | — |

Spec and Plan show the document status (`Draft`, `Approved`, `Implemented`). Tasks shows progress (done/total), since `tasks.md` has no review step.

Not assigned to a single feature:

- **Cross-cutting**, apply to every feature: NFR-01 (mobile first), NFR-02 (shared Zod validation, uniform errors), NFR-08 (test coverage).
- **Out of scope for Phase 1**: BR-12 (no in-app payments).
- **P2, not planned yet**: FR-AUTH-06 (client becomes professional), FR-NOTIF-03 (email/push notifications).
