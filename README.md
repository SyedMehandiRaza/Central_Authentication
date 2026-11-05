# Claude setup

A reusable Claude Code setup for a full-stack project: agents, rules, skills, a ticket system, docs and a worktree workflow. It has no application code. `backend/` and `frontend/` are empty folders.

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
4. Create the `shared/` and `e2e/` workspaces with the code. The rules expect them.
5. Start the first module with `/new-module <name>`.

## Parallel modules

Each module gets its own branch, folder, ports and databases. See [docs/execution/README.md](docs/execution/README.md) and [.claude/rules/parallel-work.md](.claude/rules/parallel-work.md).
