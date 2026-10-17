---
description: Draft a new feature spec (what and why) following SDD
argument-hint: <feature name or roadmap number>
---

Create or update the spec for: $ARGUMENTS

1. Read `CLAUDE.md`, `docs/constitution.md`, `docs/product/vision.md`, `docs/product/requirements.md`, `docs/product/user-flows.md`, `docs/product/glossary.md` and `docs/specs/README.md`.
2. Find the feature in the roadmap. If the folder `docs/specs/NNN-feature-name/` doesn't exist, copy `docs/specs/_template/spec.md` into it.
3. Write `spec.md` with status `Draft`: summary, user stories, testable acceptance criteria (Given/When/Then, numbered `AC-n`), applicable business rules by ID, UI/UX, out of scope.
4. Describe **what** and **why** only. No tables, endpoints or code.
5. Do not invent product decisions. Anything ambiguous goes to `Open questions`.
6. If a new requirement or business rule appears, propose adding it to `requirements.md` with a new ID.
7. Update the roadmap row in `docs/specs/README.md`.
8. Finish with a short list of the open questions for me to answer.
