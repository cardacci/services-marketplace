# 000. Monorepo setup — Plan

- **Status:** Implemented
- **Spec:** [spec.md](spec.md)

## Constitution check

| Principle | Complies? | Notes / justified deviation |
|---|---|---|
| I. Spec first | ✅ | This plan |
| II. One contract, shared | ✅ | Creates `@sm/shared`, consumed by api and web |
| III. The backend enforces the rules | N/A | No business rules yet |
| IV. Business rules are tested | N/A | No business rules yet; Vitest comes with the Nest app (ADR 0011) |
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
  - 'apps/*'
  - 'packages/*'
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

NestJS 12 generates an ES module project (`"type": "module"`, `nodenext`) with Vitest (ADR 0011) and oxlint. Adjust it:

- `name` → `@sm/api`; scripts `dev: nest start --watch`, `typecheck: tsc --noEmit`; TypeScript pinned to `~6.0`.
- Remove what the monorepo handles elsewhere: `.oxlintrc.json`, `oxlint` and `oxlint-tsgolint` (ESLint comes from `@sm/config` in T7, `code-style.md`), `.prettierrc` and the `format` script (root Prettier config), `.gitattributes` (root file).
- Remove `@nestjs/mau` and the `deploy` script (Nest's paid hosting; we deploy to Render, ADR 0005).
- If the generator creates `apps/api/.gitignore`, delete it (root covers it).
- `apps/api/.env.example` and `apps/api/.env.test.example` with the `DATABASE_URL` of each database (see Local database).

## apps/web

```bash
cd apps && pnpm create vite@latest web --template react-ts --no-interactive
```

- `name` → `@sm/web`; script `typecheck: tsc -b`; TypeScript pinned to `~6.0`.
- Add `"strict": true` to `tsconfig.app.json` and `tsconfig.node.json`: the Vite template doesn't enable it, and `CLAUDE.md` requires strict mode.
- Same cleanup as the API: remove `.oxlintrc.json` and `oxlint` (ESLint comes in T7) and `.gitignore` (root covers it).
- Remove the demo (`App.css`, `index.css`, `src/assets/`, `public/icons.svg`, README); `index.html` gets `lang="es-AR"` and the product title.
- Tailwind CSS 4 with `@tailwindcss/vite`; `@/` alias to `src/` in `vite.config.ts` and both `tsconfig.json` and `tsconfig.app.json` (the shadcn CLI reads the root one).
- shadcn/ui: `pnpm dlx shadcn@latest init --template vite --base base --preset nova --no-monorepo --no-rtl`. Base UI as the primitive library (shadcn's current default; Radix development has slowed). The init adds `Button`, `lib/utils.ts` and the theme in `index.css`.
- `lib/utils.ts` re-exports `cn` from the `cn` package (by shadcn, replaces `clsx` + `tailwind-merge`).
- Build-only packages (`tailwindcss`, `@tailwindcss/vite`, `shadcn`, needed for `shadcn/tailwind.css`) go in `devDependencies`.
- `src/components/ui/**` turns off `react-refresh/only-export-components`: shadcn components export their variants next to the component, and keeping that layout lets the CLI update them.

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
      "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
      "require": { "types": "./dist/index.d.ts", "default": "./dist/index.js" }
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
- `eslint-plugin-perfectionist` with `type: 'natural'` for `sort-imports` (groups from `code-style.md` as custom groups: `@sm/` = workspace, then `@/stores`, hooks, components, types, utils; type-only imports stay in their source group), `sort-named-imports`, `sort-named-exports`, `sort-exports`, `sort-objects`, `sort-interfaces`, `sort-object-types`, `sort-union-types`, `sort-jsx-props`, `sort-enums` and `sort-classes`.
- `@typescript-eslint/no-extraneous-class` allows decorated classes: NestJS modules are empty classes configured by `@Module`.
- Type-aware rules are disabled for plain `.js`/`.mjs` config files, which are outside every tsconfig.

`@sm/config` exports `createConfig({ react, tsconfigRootDir })` from `@sm/config/eslint`. Each package has an `eslint.config.js` that calls it with `import.meta.dirname` (`react: true` in `apps/web` adds react-hooks and react-refresh). `packages/shared` uses `eslint.config.mjs` because it isn't an ES module package (its tsup output names depend on that). `turbo.json` makes `lint` depend on `^build`, since type-aware rules read `@sm/shared`'s built types.

The root `prettier.config.mjs` re-exports `@sm/config/prettier`. `.prettierignore` skips the lockfile, build output and Markdown (docs keep their hand-written tables).

Every package has `lint` and `typecheck` scripts, except `@sm/config`, which only has `lint`: it contains JavaScript config files and no TypeScript to check. After adding the config, run `eslint . --fix` once per package (`pnpm -r exec eslint . --fix`) so the generated Nest and Vite code follows the ordering rules.

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
      - '5432:5432'
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
- `pnpm exec husky init` adds the `prepare` script, so hooks install on `pnpm install`.
- `lint-staged.config.mjs`: `*.{cjs,js,mjs,ts,tsx}` → `eslint --fix` then `prettier --write`; `*.{css,html,json,yaml,yml}` → `prettier --write`. The globs don't overlap, so no file is touched by two tasks at once.
- ESLint runs from the root and, since ESLint 10, picks the config closest to each file, so every package keeps its own rules. A root `eslint.config.mjs` covers the root config files; the root has `eslint` as a dev dependency for the hook.

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
