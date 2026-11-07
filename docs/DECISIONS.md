# Architecture and Product Decisions

Use one entry per meaningful decision that changes more than one module. Decisions inside one module go in `docs/execution/<module>/decisions/`.

## DEC-NNN: [Decision title]

- Status: Proposed | Accepted | Superseded by DEC-NNN
- Date: YYYY-MM-DD
- Context: [Why this needs deciding]
- Decision: [What we do]
- Alternatives considered: [Option (why not)]
- Consequences/trade-offs: [What this costs or makes harder]

## DEC-001: Backend-only project on the default backend stack

- Status: Accepted
- Date: 2026-11-05
- Context: The user is building a central authentication service and asked for a backend only, using JWT, Zod, Sequelize with migrations and seeders in `src`, and MySQL. The project template assumes a full stack.
- Decision: The npm workspaces are `backend/` and `shared/`, with no `frontend/` or `e2e/` workspace. Zod schemas and messages stay in `shared/`, as the validation rules require. Environment validation stays in `backend/src/config/env.js`, since it is server configuration rather than user-facing validation. Frontend, Figma and Playwright rules do not apply.
- Alternatives considered: Moving schemas into `backend/` (needs rewriting the validation rules and skills, and the schemas could not be reused by a client later).
- Consequences/trade-offs: One small extra package. Validation parity means the `shared/` and supertest checks only.
