# Services Marketplace

> 🚧 Work in progress

A marketplace where clients find nearby professionals (plumbers, gas fitters, electricians, painters, carpenters, roofers), book appointments, chat with them and leave reviews. It starts with home-repair trades and is designed to grow into any kind of service.

## Features

- **Google sign-in** with onboarding as client or professional (one account can be both).
- **Search** for professionals by category, rating, distance and name.
- **Professional profiles** with categories, weekly availability and a verified badge for licensed trades (e.g. gas fitters).
- **Appointments**: clients request date, time, description and up to 3 photos; professionals accept or reject.
- **Chat** between client and professional, enabled once an appointment is accepted.
- **Two-way reviews** after a completed appointment: stars, comment and up to 3 photos.
- **Favorites** and **notifications**.

## Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite, React Router, TanStack Query, Zustand, React Hook Form, Tailwind CSS, shadcn/ui |
| Backend | NestJS, TypeScript, Prisma, Socket.IO, Passport (Google OAuth + JWT), Swagger/OpenAPI |
| Database | PostgreSQL + PostGIS |
| Validation | Zod, shared between frontend and backend |
| Testing | Vitest + Supertest (API) |
| Tooling | pnpm workspaces, Turborepo, ESLint, Prettier, Husky, Conventional Commits |
| CI/CD | GitHub Actions |
| Hosting | Render (web static site + API), Neon (PostgreSQL) |

## Repository structure

```
apps/
  api/        NestJS backend
  web/        React frontend
packages/
  config/     Shared ESLint, TypeScript and Prettier config
  shared/     Zod schemas, types and enums shared by web and api
```

## Architecture

- **Modular monolith** in NestJS: one module per domain (auth, users, professionals, appointments, reviews, chat, notifications…), with controllers, services and data access separated.
- **Single source of truth for validation**: Zod schemas in `packages/shared` validate forms in the frontend and request bodies in the API.
- **Proximity search** with PostGIS (`geography` points and GIST indexes).

## Branching and deployment

- `develop` — integration branch. Feature branches (`feature/*`) are merged here through pull requests.
- `main` — production. Merging `develop` into `main` runs database migrations and deploys the affected apps.
- Every pull request runs lint, type checking, tests and build.

## Documentation

The project follows **Spec-Driven Development**: every feature is specified before it is built.

- [Product vision](docs/product/vision.md) and [requirements](docs/product/requirements.md)
- [Architecture](docs/architecture/overview.md) and [data model](docs/architecture/database.md)
- [Architecture decisions (ADRs)](docs/decisions/README.md)
- [Feature specs and roadmap](docs/specs/README.md)

## Getting started

### Requirements

- **Node.js 24** (pinned in `.nvmrc`; with nvm or fnm, `nvm use` / `fnm use`).
- **pnpm** through Corepack, which ships with Node: `corepack enable`. The exact version comes from `packageManager` in `package.json`.
- **Docker Desktop** for the local PostgreSQL + PostGIS database.

### First run

```bash
git clone https://github.com/cardacci/services-marketplace.git
cd services-marketplace
corepack enable
pnpm install                  # also installs the Git hooks (Husky)
docker compose up -d          # PostgreSQL + PostGIS on localhost:5432
cp apps/api/.env.example apps/api/.env
cp apps/api/.env.test.example apps/api/.env.test
pnpm dev
```

- API: <http://localhost:3000>
- Web: <http://localhost:5173>

`pnpm dev` builds `@sm/shared` first, then runs it in watch mode together with the API and the web app, all with hot reload.

The local Docker container holds two databases: `services_marketplace` for development and `services_marketplace_test` for the e2e tests. The API starts reading `DATABASE_URL` from the `.env` files with the database spec (002).

### Commands

Run from the repository root:

| Command | What it does |
|---|---|
| `pnpm dev` | Shared package (watch), API and web with hot reload |
| `pnpm build` | Builds every package in dependency order (cached by Turborepo) |
| `pnpm lint` | ESLint in every package |
| `pnpm typecheck` | TypeScript checks in every package |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm --filter @sm/api test:e2e` | API end-to-end tests (Vitest + Supertest) |
| `pnpm format` | Formats the repository with Prettier |
| `pnpm -r exec eslint . --fix` | Applies ESLint fixes (import and property ordering) in every package |
| `docker compose up -d` / `docker compose stop` | Starts / stops the local database |

Commits go through Git hooks: staged files are linted and formatted, and commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/).

## Roadmap

- [x] Monorepo setup
- [ ] CI and first deploy
- [ ] Authentication and onboarding
- [ ] Professional profiles, categories and availability
- [ ] Search with filters and proximity
- [ ] Appointments
- [ ] Chat
- [ ] Reviews and notifications
- [ ] Favorites and settings
