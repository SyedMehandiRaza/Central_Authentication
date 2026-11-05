# Module Dependency Map

## Shared foundations

Owned by the `integration-owner` agent. Modules keep their edits here small and additive.

- `shared/`: schemas, messages, error codes
- `backend/src/routes/index.js`, `backend/src/models/index.js`
- `frontend/src/app/`
- Migrations: each module adds its own files; nobody edits an existing one

## Integration order

| Module | Depends on | Status |
| ------ | ---------- | ------ |

## Third-party packages added

| Package | Workspace | Why |
| ------- | --------- | --- |
