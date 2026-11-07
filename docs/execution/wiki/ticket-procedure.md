# Ticket procedure (for implementing agents)

Every implementing agent follows this for exactly one ticket.

## Before coding

1. Read `CLAUDE.md`, the `.claude/rules/*` files relevant to the ticket, `docs/agents/*`, your ticket file in `docs/execution/<module>/tickets/`, the spec, questions and decisions it cites, and `docs/modules/<module>/`. Read [gotchas.md](gotchas.md) and [environment.md](environment.md).
2. Follow `.claude/skills/implement/SKILL.md` and `.claude/skills/tdd/SKILL.md` (red, green, refactor, one vertical slice at a time). Backend: also `.claude/skills/express-module/SKILL.md` and `.claude/skills/jest-testing/SKILL.md`. Frontend: `.claude/skills/figma-to-module/SKILL.md`. E2E: `.claude/skills/playwright-e2e/SKILL.md`.

## Hard rules

- Work only on the branch and in the folder you were given. Never read `backend/.env`.
- Backend tests use fakes for outside services and a database whose name ends in `_test`. Never send real email or call real third-party services.
- Every endpoint: `validate()` with the shared schemas, the error contract in `.claude/rules/validation.md`, and parity tests asserting the exact shared message constants in `error.fields` (import the constants, never retype strings).
- No Zod schema or user-facing message inside `backend/` or `frontend/`. Add missing ones to `shared/` with tests.
- If the ticket would change a table that already exists, add a dependency that was not agreed, or run a destructive DB command, or if a business rule is missing or two docs conflict: stop, add a question file in `docs/execution/<module>/questions/`, and report back without committing.
- If a test still fails after 3 serious attempts, use `.claude/skills/diagnosing-bugs/SKILL.md`; if still failing, stop and report.

## Finish

1. `npm run check` from the repo root (tests, lint, prettier check, build) must pass. Fix formatting with `npx prettier --write <files you changed>`.
2. Tick the ticket's criteria, set its Status to `done (YYYY-MM-DD)`, fill Verification with the test files and counts, and update its line on the module board. Update `docs/execution/<module>/STATUS.md` and any docs the change touches.
3. Add durable lessons (a new trap, an environment fact) as dated lines in the relevant wiki page.
4. One commit: `git add` only files you changed, message `feat(<module>): <summary> (<TICKET-ID>)` (or `test`/`docs`/`chore`), ending with the attribution line your session specifies.
5. Report back in under 25 lines: commit hash, files changed (short), test counts, assumptions made, anything unverified, follow-ups.
