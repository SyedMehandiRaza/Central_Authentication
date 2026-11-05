# Gotchas

Traps already hit, as dated lines. These first ones were learned on an earlier project with the same stack and machine; check they still apply.

## Tests

- 2026-10-28: Jest runs ESM through babel-jest, so `import.meta` fails in tests; use `process.cwd()` (Jest cwd is the workspace folder).
- 2026-10-28: files inside `__tests__/` are picked up as test suites; keep shared fakes outside it (for example `backend/src/test/`).
- 2026-10-29: DATETIME columns have no fractional seconds and MySQL rounds them, so compare stored times in whole seconds, and run expiry boundary tests from a whole-second clock.
- 2026-10-29: while one agent runs integration or e2e tests, nobody else runs them against the same `_test` database.
- 2026-10-29: frontend suites can hit the 5 s Jest timeout when many parallel agents load the machine. Re-run before treating it as a real failure; raise the timeout only if it recurs on a quiet machine.
- 2026-10-29: under `jest-fixed-jsdom`, `FormData` is Node's but the global `File` is jsdom's, so `formData.append(name, file)` throws. Build test files with `import { File } from 'node:buffer'`. Use `userEvent.setup({ applyAccept: false })` to test a wrong file type.
- 2026-10-29: `toHaveScreenshot` baselines are named per platform (`<name>-chromium-win32.png`); Linux CI needs its own.

## Windows and shell

- 2026-10-28: Python is not installed; large bash heredocs can fail to parse, so write scratch `.cjs` scripts and run them with node.
- 2026-10-29: checkouts have CRLF (`core.autocrlf=true`) and Prettier writes LF, so `npx prettier --write <folder>` marks every file in it as modified. Pass only the files you changed (`git diff --ignore-cr-at-eol --stat` shows the real changes).
- 2026-10-30: in Git Bash, a `--testPathPatterns` value starting with `/` is rewritten to a Windows path; start it with another character.

## Git and worktrees

- 2026-10-29: `git grep --no-index` over the working tree reads `backend/.env` despite the deny rule; scan only staged files with `git grep --cached`.
- 2026-10-29: the user edits files in parallel. Never commit their hunks; stage only your own lines.
- 2026-10-29: `npm ci` in a fresh worktree failed once with EINTEGRITY on a registry tarball; a plain retry succeeded.

## Dev servers and browser

- 2026-10-29: `npm run check` runs `prettier --check .`, which also scans untracked `.playwright-mcp/*.yml` browser snapshots; check your own files and report the rest.
- 2026-10-29: nodemon restarts on every save under `backend/src`, so a health probe can hit a server that is not yours. Check who owns the port (`Get-NetTCPConnection -LocalPort <port>`) before stopping anything, and never kill processes you did not start.
- 2026-10-29: the Playwright MCP browser is shared between parallel agents: its first page may be another agent's, so navigate to your own port and close only your page. It saves screenshots only under the main checkout, not the scratchpad or a worktree path.

## Permissions

- 2026-10-29: the auto-mode classifier blocks `sequelize-cli db:migrate:undo:all`, even on a test database. Make a migration round-trip test opt-in, for the user to run.
