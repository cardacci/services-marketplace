# NNN. Feature name — Tasks

- **Plan:** [plan.md](plan.md)

Branch: `feature/feature-name` from `develop`.

Rules: tasks are small (≈ one commit), ordered, and each one leaves the project building and tests passing. Tests belong to the task that introduces the behavior, not to a separate final task. Tick them as they are done.

## Tasks

- [ ] **T1** — Description. _Done when:_ verifiable condition.
- [ ] **T2** — …

## Definition of done

- [ ] All acceptance criteria covered by tests, or by a manual check listed in the plan's Testing table.
- [ ] `pnpm turbo run lint typecheck test build` green.
- [ ] Docs updated (`database.md`, `requirements.md`, ADRs if needed).
- [ ] Spec and plan status set to `Implemented`; roadmap in `docs/specs/README.md` updated.
