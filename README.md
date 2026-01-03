**Project Overview**

This repository is a Bun-first Elysia application organized using the recommended Elysia-style MVC. It keeps controllers as `Elysia` instances, business logic in services, and runtime validation in models.

**Folder Structure**

```
src/
├─ server.ts                # App entry (listen)
├─ app.ts                   # Root Elysia instance
│
├─ modules/                 # Feature-based modules
│  ├─ health/
│  │  └─ index.ts           # Health check endpoint
│  │
│  ├─ auth/
│  │  ├─ index.ts           # Controller (Elysia instance)
│  │  ├─ service.ts         # Business logic (no HTTP)
│  │  └─ model.ts           # Validation & DTO (elysia.t)
│  │
│  ├─ user/
│  │  ├─ index.ts
│  │  ├─ service.ts
│  │  └─ model.ts
│  │
│  └─ booking/
│     ├─ index.ts
│     ├─ service.ts
│     └─ model.ts
│
├─ plugins/                 # Request-dependent services (Elysia plugins)
│  ├─ error.ts              # Global error handler
│  ├─ auth.guard.ts         # Authentication guard macro
│  └─ db.ts
│
├─ lib/                     # Pure helpers (mongoose, hash, logger)
│  ├─ db.ts                 # MongoDB & mongoose helpers
│  ├─ hash.ts
│  └─ logger.ts
│
├─ config/
│  └─ env.ts
```
 
**Key files**

- **Server**: [src/server.ts](src/server.ts) — starts the application (`app.listen(PORT)`).
- **App**: [src/app.ts](src/app.ts) — assembles the root `Elysia` instance and registers plugins and modules.
- **Health**: [src/modules/health/index.ts](src/modules/health/index.ts) — simple endpoint for load balancers and monitoring.
- **Modules**: each feature folder under [src/modules](src/modules) owns its controller, service, and model (for example [src/modules/auth/index.ts](src/modules/auth/index.ts)).
- **Plugins**: request-scoped logic and global handlers in [src/plugins](src/plugins) (for example [src/plugins/error.ts](src/plugins/error.ts), [src/plugins/auth.guard.ts](src/plugins/auth.guard.ts)).
- **Lib**: pure helpers that are request-agnostic in [src/lib](src/lib).
- **Config**: environment and constants in [src/config](src/config).
- **Env**: template at [.env.example](.env.example) for setup.

**Run & Development**

- Install dependencies (if needed): `bun install`
- Copy `.env.example` to `.env` and adjust values: `cp .env.example .env`
- Dev (watch `server.ts`): `bun run dev`
- Start (run server): `bun run start`
- Print the app URL from terminal: `bun run url`
- Open the app URL in default browser: `bun run open`

Default URL: `http://localhost:3000` (set `PORT` via environment variable to change).

- **Production checklist**

- ✅ MongoDB + mongoose integration via `DbPlugin`
- ✅ Global error handler via `ErrorPlugin`
- ✅ Health check endpoint at `/health`
- ✅ Environment variables template (`.env.example`) with `MONGODB_URI`
- ✅ Controllers as Elysia instances (not classes)
- ✅ Services without HTTP or Context coupling
- ✅ Models as single source of truth (elysia.t)
- ✅ Plugins only for request-dependent logic

Notes

- `src/server.ts` + `src/app.ts` is the single entry point (no competing examples).
- `src/index.ts` was deleted (it conflicted with the modular approach).
- Services contain only business logic (no HTTP, no Context). Controllers are `Elysia` instances and use `t` schemas for runtime validation.

If you want next, I can add:

- JWT auth flow with access + refresh tokens
- Mongoose schemas for auth/user/booking modules
- Rate limiting
- WebSocket module
- Tests with bun:test
- Docker + deploy checklist
