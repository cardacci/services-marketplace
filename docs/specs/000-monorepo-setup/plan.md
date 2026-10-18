# 000. Monorepo setup — Plan

- **Status:** Approved
- **Spec:** [spec.md](spec.md)

## Constitution check

| Principle | Complies? | Notes / justified deviation |
|---|---|---|
| I. Spec first | ✅ | This plan |
| II. One contract, shared | ✅ | Creates `@sm/shared`, consumed by api and web |
| III. The backend enforces the rules | N/A | No business rules yet |
| IV. Business rules are tested | N/A | No business rules yet; Jest comes with the Nest app |
| V. History is never lost | N/A | No data yet |
| VI. Secure and private by default | ✅ | `.env` ignored, only `.env.example` versioned |
| VII. Simplicity first | ✅ | Each tool is justified in ADR 0001 |
| VIII. Zero cost until there are users | ✅ | Local tooling only |
| IX. Docs travel with code | ✅ | T10 updates README and CLAUDE.md |

## Approach

pnpm workspaces + Turborepo at the root. NestJS and Vite apps generated with their CLIs, renamed to the `@sm/` scope and installed from the root (single lockfile). `@sm/shared` compiled with tsup to CJS + ESM + `.d.ts`.

## Prerequisites

- Node 24 LTS (`.nvmrc` with `24`).
- pnpm through Corepack (`corepack enable`).
- Docker Desktop.

## Versions

- **TypeScript is pinned to `~6.0` in every package.** TypeScript 7 (the native Go compiler) doesn't ship the JavaScript compiler API yet, and the toolchain needs it: tsup generates `.d.ts` files through it, typescript-eslint's type-aware rules use it, and so does the Nest CLI. Revisit when those tools support TypeScript 7.
- **pnpm blocks dependency build scripts by default.** Allowed ones are listed under `allowBuilds` in `pnpm-workspace.yaml` (`pnpm approve-builds <package>`). Only add a package after checking why it needs a script; `esbuild` (used by tsup) downloads its platform binary.

## Root files

`package.json`:

```json
{
  "name": "services-marketplace",
  "private": true,
  "packageManager": "pnpm@<version from pnpm -v>",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "format": "prettier --write ."
  }
}
```

`pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

`turbo.json`:

```json
{
  "$schema": "https://turborepo.com/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "dependsOn": ["^build"], "cache": false, "persistent": true },
    "typecheck": { "dependsOn": ["^build"] },
    "lint": {},
    "test": { "dependsOn": ["^build"] }
  }
}
```

`^build` = build the packages I depend on first, so `@sm/shared` is compiled before `api` and `web` start.

## apps/api

```bash
cd apps && pnpm dlx @nestjs/cli new api --package-manager pnpm --skip-git --skip-install --strict
```

- `name` → `@sm/api`; scripts `dev: nest start --watch`, `typecheck: tsc --noEmit`.
- Delete `apps/api/.gitignore` (root covers it).
- `apps/api/.env.example` and `apps/api/.env.test.example` with the `DATABASE_URL` of each database (see Local database).

## apps/web

```bash
cd apps && pnpm create vite@latest web --template react-ts
```

- `name` → `@sm/web`; script `typecheck: tsc -b`.
- Tailwind CSS (Vite plugin) and shadcn/ui init with the `@/` path alias; add the `Button` component.

## packages/shared

`package.json`:

```json
{
  "name": "@sm/shared",
  "version": "0.0.0",
  "private": true,
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "typecheck": "tsc --noEmit"
  }
}
```

`tsconfig.json`: `target ES2022`, `module ESNext`, `moduleResolution Bundler`, `strict`, `declaration`, `skipLibCheck`, `include: ["src"]`.

First real content, `src/index.ts`:

```ts
import { z } from 'zod';

export const APPOINTMENT_STATUS = ['pending', 'accepted', 'rejected', 'cancelled', 'completed'] as const;
export const appointmentStatusSchema = z.enum(APPOINTMENT_STATUS);
export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>;
```

Dependencies: `zod`; dev `tsup`, `typescript`. Linked into apps with `pnpm --filter @sm/api add @sm/shared@workspace:*` (same for web).

## packages/config

Shared `tsconfig.base.json`, ESLint flat config and Prettier config consumed by the three packages, following [`code-style.md`](../../architecture/code-style.md).

`prettier.config.js`:

```js
export default {
	arrowParens: 'always',
	endOfLine: 'lf',
	printWidth: 100,
	semi: true,
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
};
```

ESLint flat config:

- `typescript-eslint` strict, type-aware rules, and `eslint-config-prettier` last so formatting is left to Prettier.
- `eslint-plugin-perfectionist` with `type: 'alphabetical'` for `sort-imports` (groups from `code-style.md`, `@sm/` and `@/` as internal), `sort-named-imports`, `sort-named-exports`, `sort-exports`, `sort-objects`, `sort-interfaces`, `sort-object-types`, `sort-union-types`, `sort-jsx-props` and `sort-classes`. Exact option names follow the installed plugin version.
- A `react` variant for `apps/web` that adds `eslint-plugin-react-hooks`.

Each app's `eslint.config.js` imports the base or the `react` variant. After adding the config, run `pnpm lint --fix` once so the generated Nest and Vite code follows the ordering rules.

## Local database

`docker-compose.yml`:

```yaml
services:
  db:
    image: postgis/postgis:17-3.5
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: services_marketplace
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docker/postgres-init/20-create-test-db.sql:/docker-entrypoint-initdb.d/20-create-test-db.sql:ro

volumes:
  pgdata:
```

The image creates `services_marketplace` with PostGIS enabled (its own `10_postgis.sh` init script). The test database used by the e2e suite (`testing-strategy.md`) lives in the same container and is created by our script, which runs after it. The file is mounted on its own, not as a folder: the entrypoint ignores subfolders, and mounting over the whole `/docker-entrypoint-initdb.d` would hide the image's PostGIS script.

`docker/postgres-init/20-create-test-db.sql`:

```sql
CREATE DATABASE services_marketplace_test;
\connect services_marketplace_test
CREATE EXTENSION IF NOT EXISTS postgis;
```

Postgres runs the init scripts only when the data volume is empty. If the container was started before the script existed, recreate it with `docker compose down -v` (deletes local data) or run the script once with `docker compose exec db psql -U postgres -f /docker-entrypoint-initdb.d/20-create-test-db.sql` (it reads the file already mounted in the container, so it works the same in PowerShell and bash).

The script must keep LF line endings: a `\r` from Windows line endings can end up inside the `\connect` argument. `.gitattributes` enforces it with `*.sql text eol=lf`.

`.gitignore` ignores `.env.*` except `.env.example` and `.env.*.example`, so `.env.test.example` is versioned and `.env.test` is not.

`apps/api/.env.example` and `apps/api/.env.test.example` document both connection strings:

```bash
# .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/services_marketplace
# .env.test
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/services_marketplace_test
```

On Apple Silicon the image runs emulated (slower, works).

## Quality tooling

- ESLint (flat config) + Prettier.
- Husky `pre-commit` → lint-staged; `commit-msg` → commitlint with `@commitlint/config-conventional`.

## Testing

| Acceptance criterion / rule | Test level | Test |
|---|---|---|
| AC-1, AC-2 | manual | `pnpm dev`, both apps show the statuses from `@sm/shared` |
| AC-3 | manual | `docker compose exec db psql -U postgres -d services_marketplace -c "SELECT postgis_version();"`, then the same with `-d services_marketplace_test` |
| AC-4 | manual | `pnpm turbo run lint typecheck test build` green (includes the sample tests generated by Nest) |
| AC-5, AC-6 | manual | Bad commit message rejected; badly formatted file fixed on commit |
| AC-7 | manual | Page renders a styled shadcn `Button` |
| AC-8 | manual | Review of the PR diff |

## Risks and alternatives

- Nest CLI may create its own lockfile or git repo → mitigated with `--skip-install --skip-git`.
- ESM/CJS mismatch when importing `@sm/shared` from Nest → mitigated by dual build with tsup.

## Open questions

None for now.
