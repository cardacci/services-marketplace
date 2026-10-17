---
description: Implement the next pending task of a spec
argument-hint: <spec number, e.g. 003> [task id]
---

Implement the next task for spec $ARGUMENTS.

1. Read `CLAUDE.md`, `docs/constitution.md`, then `spec.md`, `plan.md` and `tasks.md` of the spec. Spec and plan must be `Approved`.
2. Take the first unchecked task (or the one I named). Implement **only that task**.
3. Follow the plan and the conventions in `docs/architecture/`. If the plan turns out to be wrong or incomplete, stop and propose the doc change before coding around it.
4. Write or update the tests the task requires and run lint, typecheck and tests for the affected packages.
5. Tick the task in `tasks.md` and update any doc whose content changed.
6. Summarize what changed and propose a Conventional Commit message. Do not start the next task.
