# Module Dependency Map

## Shared foundations

Owned by the `integration-owner` agent. Modules keep their edits here small and additive.

- `shared/`: schemas, messages, error codes
- `backend/src/routes/index.js`, `backend/src/models/index.js`
- Migrations: each module adds its own files; nobody edits an existing one

## Integration order

| Module | Depends on | Status |
| ------ | ---------- | ------ |

## Third-party packages added

| Package | Workspace | Why |
| ------- | --------- | --- |
| express | backend | HTTP framework |
| sequelize, mysql2 | backend | ORM and MySQL driver |
| sequelize-cli | backend (dev) | Migrations and seeders |
| zod | backend, shared | Validation |
| jsonwebtoken | backend | Access and refresh tokens |
| bcryptjs | backend | Password hashing, with no native build |
| helmet, cors | backend | Security headers and CORS allow-list |
| cookie-parser | backend | Reads the refresh token cookie |
| express-rate-limit | backend | Rate limiting on auth routes |
| pino | backend | Structured logging with redaction |
| dotenv | backend | Loads `backend/.env` |
| jest, babel-jest, @babel/core, @babel/preset-env | root (dev) | Tests, with ESM run through Babel |
| supertest | backend (dev) | HTTP integration tests |
| eslint, @eslint/js, globals, prettier | root (dev) | Lint and format |
