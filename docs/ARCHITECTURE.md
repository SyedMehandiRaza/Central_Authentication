# Architecture

## Current state

Backend foundation only: app bootstrap, config, middleware, JWT and password helpers, and the migration and seeder setup. There are no business modules, tables or auth endpoints yet. The only endpoint is `GET /api/health`.

## Technology stack

Confirmed in DEC-001: JavaScript (ESM), Node.js 22+, Express 5, Sequelize 6 with `sequelize-cli`, MySQL 8.0.16+ (target 8.4), Zod 4, `jsonwebtoken`, `bcryptjs`, `helmet`, `cors`, `cookie-parser`, `express-rate-limit`, `pino`, Jest and supertest.

## Repository layout

```
shared/     Zod schemas, messages, error codes (@app/shared)
backend/    Express API. Layout: .claude/rules/backend.md
docs/       Project docs, module specs, tickets
```

`frontend/` is an unused placeholder and is not a workspace (DEC-001).

## Request flow

Client to `helmet`, CORS allow-list, JSON body parser (100 kB limit) and cookie parser, then `/api` routes, then `notFound` and `errorHandler`.

Protected routes use `authenticate` (verifies the Bearer access token, sets `req.user`) and `authorize(...roles)`. Inputs go through `validate({ body, params, query })`, and controllers read `req.validated`. Auth routes must add a limiter from `createAuthRateLimiter()`.

`server.js` connects to the database and refuses to start on anything older than MySQL 8.0.16, or on MariaDB.

## Module boundaries and ownership

Shared foundations and their owner: `DEPENDENCIES.md` and `.claude/rules/parallel-work.md`.

## Environment variables (names only)

Listed in `backend/env.example` and validated at startup by `backend/src/config/env.js`.

- `NODE_ENV`: `development`, `test` or `production`
- `PORT`: API port
- `LOG_LEVEL`: pino log level
- `CORS_ORIGINS`: comma-separated browser origins allowed to call the API
- `TRUST_PROXY`: number of reverse proxies in front of the app, needed for correct client IPs in rate limiting
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`: MySQL connection
- `DB_NAME`: application database
- `DB_NAME_TEST`: test database; must end with `_test`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`: signing secrets; different values, at least 32 characters
- `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`: token lifetimes such as `15m` or `7d`

## Environments

- Local: API on port 5000, MySQL on 127.0.0.1:3306. Testing and production are not defined yet.

## Architecture constraints

- Migrations and seeders are `.cjs` files in `backend/src/migrations` and `backend/src/seeders`. Run history is stored in `sequelize_meta` and `sequelize_data`.
- Rate limiter counts are in memory, so they are per process. Running several instances needs a shared store.
