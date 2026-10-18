# 000. Monorepo setup — Tasks

- **Plan:** [plan.md](plan.md)

Branch: `feature/monorepo-setup` from `develop`.

## Tasks

- [ ] **T1** — Root workspace: `.nvmrc`, `package.json`, `pnpm-workspace.yaml`, `turbo.json`, install `turbo`. _Done when:_ `pnpm turbo --version` works.
- [ ] **T2** — `packages/shared` with tsup build and the appointment status schema. _Done when:_ `pnpm --filter @sm/shared build` creates `dist/index.js`, `index.mjs` and `index.d.ts`.
- [ ] **T3** — Generate `apps/api` with Nest CLI, rename to `@sm/api`, add scripts, link `@sm/shared`. _Done when:_ `GET /` returns the statuses from `@sm/shared`.
- [ ] **T4** — Generate `apps/web` with Vite, rename to `@sm/web`, add scripts, link `@sm/shared`. _Done when:_ the page shows the statuses from `@sm/shared`.
- [ ] **T5** — `pnpm dev` from the root starts shared (watch), api and web. _Done when:_ AC-1 and AC-2 pass.
- [ ] **T6** — `docker-compose.yml` with PostGIS, the init script that creates the test database, `apps/api/.env.example` and `apps/api/.env.test.example`. _Done when:_ AC-3 passes.
- [ ] **T7** — `packages/config` with shared tsconfig, ESLint and Prettier; apps extend it; `lint` and `typecheck` scripts in every package. _Done when:_ AC-4 passes.
- [ ] **T8** — Tailwind CSS and shadcn/ui in `apps/web`, add `Button`. _Done when:_ AC-7 passes.
- [ ] **T9** — Husky, lint-staged and commitlint. _Done when:_ AC-5 and AC-6 pass.
- [ ] **T10** — Update `README.md` "Getting started" and the `Commands` section of `CLAUDE.md`. _Done when:_ a fresh clone can follow them.

## Definition of done

- [ ] All acceptance criteria verified.
- [ ] `pnpm turbo run lint typecheck test build` green.
- [ ] Spec and plan status set to `Implemented`; roadmap updated.
- [ ] PR to `develop` merged with squash.
