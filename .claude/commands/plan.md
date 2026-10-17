---
description: Write the technical plan (how) for an approved spec
argument-hint: <spec number, e.g. 003>
---

Write the technical plan for spec $ARGUMENTS.

1. Open `docs/specs/$ARGUMENTS-*/spec.md`. If its status is not `Approved`, stop and tell me which open questions block it.
2. Read `docs/constitution.md`, `docs/architecture/*.md` and the ADRs in `docs/decisions/` that apply.
3. Create `plan.md` from `docs/specs/_template/plan.md` with status `Draft`: data model changes, `@sm/shared` schemas, API endpoints table, web routes/components/hooks, and a testing table mapping every acceptance criterion and business rule to a test.
4. Fill the **Constitution check** table. If a principle can't be met, justify the deviation or stop and tell me.
5. Follow the conventions in `api-conventions.md`, `frontend-conventions.md` and `database.md`. If the plan needs to break a convention or make a significant new decision, propose an ADR instead of doing it silently.
6. List risks and open questions.
