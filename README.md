# Services Marketplace

> 🚧 Work in progress - personal full-stack project.

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
| Testing | Jest, Supertest, Testcontainers, Vitest, Testing Library, Playwright |
| Tooling | pnpm workspaces, Turborepo, ESLint, Prettier, Husky, Conventional Commits |
| CI/CD | GitHub Actions |
| Hosting | Vercel (web), Render (API), Neon (PostgreSQL) |

## Repository structure

```
apps/
  web/        React frontend
  api/        NestJS backend
packages/
  shared/     Zod schemas, types and enums shared by web and api
  config/     Shared ESLint, TypeScript and Prettier config
```

## Architecture

- **Modular monolith** in NestJS: one module per domain (auth, users, professionals, appointments, reviews, chat, notifications…), with controllers, services and data access separated.
- **Single source of truth for validation**: Zod schemas in `packages/shared` validate forms in the frontend and request bodies in the API.
- **Proximity search** with PostGIS (`geography` points and GIST indexes).

## Branching and deployment

- `develop` - integration branch. Feature branches (`feature/*`) are merged here through pull requests.
- `main` - production. Merging `develop` into `main` runs database migrations and deploys the affected apps.
- Every pull request runs lint, type checking, tests and build.

## Getting started

Setup instructions will be added as the project is scaffolded.

Requirements:

- Node.js (LTS)
- pnpm
- Docker (local PostgreSQL + PostGIS)

## Roadmap

- [ ] Monorepo setup, CI and first deploy
- [ ] Authentication and onboarding
- [ ] Professional profiles, categories and availability
- [ ] Search with filters and proximity
- [ ] Appointments
- [ ] Chat
- [ ] Reviews and notifications
- [ ] Favorites and settings
