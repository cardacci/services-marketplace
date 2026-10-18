# Code style

Applies to every package (`apps/api`, `apps/web`, `packages/*`). Formatting and ordering are enforced by tools from `@sm/config`, so reviews don't discuss them. Frontend component structure: [`frontend-conventions.md`](frontend-conventions.md#component-structure).

## Formatting (Prettier)

| Option | Value |
|---|---|
| `useTabs` | `true` |
| `singleQuote` | `true` (JSX attributes keep double quotes) |
| `semi` | `true` |
| `trailingComma` | `'all'` |
| `printWidth` | `100` |
| `arrowParens` | `'always'` |
| `endOfLine` | `'lf'` |

`.gitattributes` keeps LF line endings in the working copy on Windows too, so Prettier and Git agree.

## Alphabetical ordering

Everything that can be sorted alphabetically **is** sorted alphabetically within its block:

- Import specifiers within each import group, and export lists.
- Object keys, interface and type properties, union members, enum-like constant keys.
- Destructured props and JSX props on each element.
- Hook declarations of the same kind (`useState`, `useRef`, `useMemo`, `useCallback`), functions and `useEffect` blocks.
- Class members of the same kind and visibility (NestJS services, controllers).
- Dependency arrays of hooks.

**Exception:** when a declaration depends on another in the same block, the dependency comes first. When a tool would reorder something whose order matters (e.g. object spreads, middleware order), disable the rule for that line with a comment explaining why.

## Import groups

Groups in this order, separated by a blank line, sorted alphabetically inside:

1. Node built-ins and external packages (`react`, `@nestjs/*`, `@tanstack/*`, `zod`…).
2. Workspace packages (`@sm/shared`).
3. App modules by kind (web): stores → API hooks and custom hooks → components → types → utils, constants and assets.
4. Relative imports (`../`, `./`).

Type-only imports use `import type`.

## Enforcement (ESLint)

`@sm/config` exports the ESLint flat config used by every package:

- `typescript-eslint` (strict, type-aware) and `eslint-config-prettier`.
- `eslint-plugin-perfectionist` (alphabetical, natural order) for imports, named imports/exports, objects, interfaces, object types, union types, JSX props and class members.
- Web only: `eslint-plugin-react-hooks` (rules of hooks and exhaustive deps).

`pnpm lint --fix` applies the ordering automatically; lint-staged runs it on every commit.

## TypeScript

- No `enum`: use `as const` arrays or objects plus `z.enum` from `@sm/shared` (Vite's `erasableSyntaxOnly` setting forbids enums, and the API shares the same values).
- No `any` without a comment explaining why (`CLAUDE.md`).
- Types, interfaces and constants live at module scope, never inside a function or component.
