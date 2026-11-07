# Execution docs

How work is tracked. Rules: [docs/agents/issue-tracker.md](../agents/issue-tracker.md).

## Folder map

```
docs/execution/
  README.md            this file
  _templates/          ticket, question, decision, module README and status templates
  wiki/                notes shared by every module (gotchas, environment, user preferences)
  <module>/            board (README.md), STATUS.md, tickets/, questions/, decisions/, specs/
```

## Start a module's tracker

1. Pick a prefix and add a row to both tables below.
2. Create `docs/execution/<module>/` with `tickets/`, `questions/`, `decisions/` and `specs/`.
3. Copy `_templates/module-README.md` to `<module>/README.md` and `_templates/STATUS.md` to `<module>/STATUS.md`.

`/new-module <name>` does this for you.

## Module prefixes

| Module | Prefix | Branch | Folder (git worktree) |
| ------ | ------ | ------ | --------------------- |
| auth   | AUTH   | `feature/auth` | main checkout (1st row) |

## Working on modules in parallel

Each module has its own folder on disk (a git worktree on its own branch), its own Claude session and its own databases and ports, so the sessions never touch each other's files or data.

Create a module folder from the main checkout:

```
git worktree add -b feature/<module> ..\<project>-<module> main
```

Give each folder the next free row. Dev ports go up by 100 (web) and 10 (API); E2E web is dev web + 1; E2E API is 5100 plus the same step.

| Folder | Dev web / API | E2E web / API | Databases |
| ------ | ------------- | ------------- | --------- |
| 1st | 5173 / 5000 | 5174 / 5100 | `<project>`, `<project>_test` |
| 2nd | 5273 / 5010 | 5274 / 5110 | `<project>_<module>`, `<project>_<module>_test` |
| 3rd | 5373 / 5020 | 5374 / 5120 | `<project>_<module>`, `<project>_<module>_test` |

- Each folder has its own `backend/.env` (`PORT`, `DB_NAME`, `DB_NAME_TEST`, `CORS_ORIGINS`) and a root `.env.worktree`. Both are git-ignored. The Vite config, the Playwright config and the backend test setup must read `.env.worktree` when it exists; without it the first row's defaults apply.
- `.env.worktree` holds these names:

  ```
  WORKTREE_MODULE=
  WEB_PORT=
  API_PROXY_TARGET=
  DB_NAME_TEST=
  E2E_WEB_URL=
  E2E_API_URL=
  ```

- Never run `git checkout` of another branch inside a module folder, and never edit files in another module's folder.
- Shared foundations (`shared/` schemas, messages and error codes, `backend/src/routes/index.js`, `backend/src/models/index.js`, `frontend/src/app/`) are edited by every module. Keep those edits small and additive (add lines, don't reorder or reformat), so merging the modules into `testing` one after another stays easy.
- Migrations: each module adds its own files with a timestamp name; never edit another module's or an existing migration.

## Sub-agent worktrees inside a module

If a module session runs tickets in sub-agents with their own worktrees, it names them after the ticket, not a random id. See `.claude/rules/parallel-work.md`, "Git worktrees".
