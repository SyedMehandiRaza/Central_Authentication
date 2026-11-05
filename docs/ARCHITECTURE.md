# Architecture

## Current state

No application code yet.

## Technology stack

Default stack in `CLAUDE.md`, not yet confirmed. Record the final choice here and as a decision in `DECISIONS.md`.

## Repository layout

```
shared/     Zod schemas, messages, error codes (not created yet)
backend/    Express API. Layout: .claude/rules/backend.md
frontend/   React app. Layout: .claude/rules/frontend.md
e2e/        Playwright tests (not created yet)
docs/       Project docs, module specs, tickets
```

## Request flow

[Browser to API to database, including auth.]

## Module boundaries and ownership

Shared foundations and their owner: `DEPENDENCIES.md` and `.claude/rules/parallel-work.md`.

## Environment variables (names only)

- [NAME]: [what it is for]

## Environments

- [Local, testing, production]

## Architecture constraints

- [Constraint]
