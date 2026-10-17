---
description: Break an approved plan into ordered, verifiable tasks
argument-hint: <spec number, e.g. 003>
---

Create the task list for spec $ARGUMENTS.

1. Open `docs/specs/$ARGUMENTS-*/plan.md`. If its status is not `Approved`, stop and tell me.
2. Create `tasks.md` from `docs/specs/_template/tasks.md`.
3. Tasks must be small (about one commit), ordered by dependency, and each must leave the project building with tests passing.
4. Every task has a concrete `Done when:` condition. Tests are part of the task that introduces the behavior, not a separate final task.
5. Include doc updates (database.md, requirements.md, roadmap) as tasks where needed.
