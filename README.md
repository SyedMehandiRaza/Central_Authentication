# Central Authentication

Backend-only central authentication service: Node.js, Express 5, JWT, Zod, Sequelize and MySQL. The foundation is in place; auth endpoints and tables come with the first module.

## Run the backend

Requires Node.js 22+ and MySQL 8.0.16+ (8.4 recommended).

1. Install: `npm install`
2. Copy `backend/env.example` to `backend/.env` and fill it in. The file explains how to generate the JWT secrets.
3. Start MySQL, then create the database: `npm run db:create -w backend`
4. Apply migrations and seeders: `npm run db:migrate -w backend`, then `npm run db:seed -w backend`
5. Start the API: `npm run dev`, then open http://localhost:5000/api/health

| Command | What it does |
| ------- | ------------ |
| `npm test` | All Jest suites (no database needed yet) |
| `npm run check` | Tests, lint and format check |
| `npm run migration:new -w backend -- <name>` | New migration in `backend/src/migrations`; rename it to `.cjs` |
| `npm run seed:new -w backend -- <name>` | New seeder in `backend/src/seeders`; rename it to `.cjs` |
| `npm run db:migrate:status -w backend` | Shows which migrations have run |
| `npm run db:migrate:undo -w backend` | Reverts the latest migration |

# Claude setup

The agents, rules, skills, ticket system, docs and worktree workflow used to build this project.

## What is here

| Path | What it is |
| ---- | ---------- |
| `CLAUDE.md` | Entry point Claude reads first: stack, workflow, non-negotiables, definition of done |
| `.claude/agents/` | 6 agents: architect, db-architect, developer, integration-owner, qa-reviewer, ui-implementer |
| `.claude/rules/` | 11 rule files: backend, database, documentation, frontend, general, git-workflow, parallel-work, planning, security, testing, validation |
| `.claude/skills/` | Project skills (`/new-module`, `/db-design`, ...) and Matt Pocock skills (`/grill-me`, `/tdd`, `/to-tickets`, ...) |
| `.claude/settings.json` | Permissions (allow, ask, deny) and enabled plugins |
| `docs/agents/` | How skills use the tracker, labels and domain docs |
| `docs/execution/` | Tickets, questions, decisions and specs: templates, worktree table, wiki |
| `docs/modules/` | Module spec, database and Figma templates |
| `docs/*.md`, `GLOSSARY.md` | Empty project docs to fill in |
| `script/keep-claude-working.ps1` | Keeps Claude working on `TASK.md` through limits and lost internet |
| `skills-lock.json` | Versions of the Matt Pocock skills |
| `.gitignore`, `.gitattributes` | Keep `.env`, `.claude/worktrees/` and local settings out of git; keep line endings LF |

## Start a project

1. Open this folder in VS Code and run `claude` here, so Claude loads this `CLAUDE.md` and `.claude/`.
2. Fill in `docs/PROJECT.md` and the Purpose and Stack sections of `CLAUDE.md`. If the stack is different, update the matching rules and skills too.
3. Run `git init` and make the first commit. Branches and worktrees need a repository.
4. Start the first module with `/new-module <name>`.

## Parallel modules

Each module gets its own branch, folder, ports and databases. See [docs/execution/README.md](docs/execution/README.md) and [.claude/rules/parallel-work.md](.claude/rules/parallel-work.md).
