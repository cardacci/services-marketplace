# Deployment and workflow

## Environments

| Environment | Branch | Web | API | Database |
|---|---|---|---|---|
| Local | any | Vite dev server `:5173` | Nest `:3000` | Docker `postgis/postgis` |
| Development | `develop` | — (local only for now) | — | Neon branch `develop` |
| Production | `main` | Render static site | Render web service | Neon branch `main` |

## Hosting (free tiers)

| Piece | Provider | Notes |
|---|---|---|
| Web (static SPA) | Render static site | Build `apps/web`, publish `apps/web/dist`. Rewrite rule `/*` → `/index.html` so client-side routes work. |
| API | Render free web service | Sleeps after ~15 min idle; first request takes ~1 min. 750 free hours/month. |
| Database | Neon (free) | 0.5 GB per project, scales to zero, PostGIS supported, DB branches for develop/prod. Render's free Postgres is not used because it expires after 30 days. |
| Images | Cloudflare R2 or Cloudinary | Free tier; direct uploads with signed URLs. |

Moving to paid hosting is decided when the project has real users.

## Branching

```
feature/* ──squash──▶ develop ──merge commit──▶ main ──▶ deploy
```

- Default branch: `develop`.
- `feature/<short-name>` (or `fix/`, `docs/`, `chore/`) created from `develop`.
- `develop` → `main` with a **merge commit**, never squash, so the branches don't diverge.
- Feature branches are deleted automatically after merge.

## GitHub rulesets

Both `main` and `develop`:

- Restrict deletions, block force pushes.
- Require a pull request (0 approvals — solo project) and conversation resolution.
- Require status checks: `ci` (added once the workflow has run once), branch up to date.
- Allowed merge method: `main` → Merge only; `develop` → Squash only.

## CI/CD (GitHub Actions)

**On every pull request** (`ci.yml`):

1. Install with pnpm (cached).
2. `turbo run lint typecheck test build` (only affected packages).

**On push to `main`** (`deploy.yml`):

1. Run CI again.
2. `prisma migrate deploy` against the production database.
3. Trigger the Render deploy hook of the API if `apps/api` or `packages/shared` changed.
4. Trigger the Render deploy hook of the web if `apps/web` or `packages/shared` changed.

Auto-deploy is turned **off** in both Render services, so nothing deploys unless CI passed and migrations ran.

## Secrets

| Secret | Where |
|---|---|
| `DATABASE_URL` (prod) | GitHub Actions secrets, Render env vars |
| `RENDER_API_DEPLOY_HOOK_URL`, `RENDER_WEB_DEPLOY_HOOK_URL` | GitHub Actions secrets |
| `JWT_*`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Render env vars |
| `VITE_API_URL` | Render static site env vars (used at build time) |

Never in the repository. Local values in `.env` files (git-ignored); keys documented in `.env.example`.

## Local quality gates

Husky + lint-staged run lint and format on staged files; commit messages follow Conventional Commits (commitlint).
