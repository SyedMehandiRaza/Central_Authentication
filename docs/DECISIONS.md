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

## DEC-002: Central identity model: one person with per-application panel access

- Status: Accepted
- Date: 2026-11-07
- Context: One person (one email, one password) must be able to log in to every panel of fyinder (Node), real_estate (Laravel) and later construction (Node). Today each app has its own users table, password and role list, so the same person has a separate login per app, possibly with different passwords.
- Decision:
  - This service is the single source of truth for identity: email, password, email verification, the person's name, account status, and which panels a person may enter.
  - A person is one `users` row. Their public id is `users.uuid`; applications store it in their own `users` row (`auth_user_uuid`, added later in each app's repo) and never see the internal numeric id.
  - Panels are rows in `app_roles`, scoped by `applications`. Panel access is a `user_app_roles` row (one per person and panel), with a status and how it was granted.
  - Applications keep their own profiles, companies, relations and fine-grained permissions exactly as today. This service does not model them.
  - Passwords live only here. After integration, apps never store, copy or check a password. Changing or resetting a password revokes every refresh token of that person in every application.
  - A session is one login into one application (`refresh_tokens.application_id`), not into one panel. The access token lists the person's active panels in that application.
  - `users.profile_version` goes up on every change to `full_name` or `email`, so apps can ignore out-of-date name/email sync events (delivered later by BullMQ, and signed webhooks for Laravel).
- Alternatives considered: A global roles table shared by every app (panel names collide, such as AGENT and ADMIN in both apps, and the panels mean different things per app). Keeping per-app passwords and linking accounts (two passwords for one person, and a password change would not reach every app). Moving app profiles into this service (couples every app's release cycle to this one; the apps keep their schemas).
- Consequences/trade-offs: Every app must be changed to call this service for login and to store `auth_user_uuid`. Importing existing users must merge the same email from several apps into one person and choose one password (or force a reset). Phone-only fyinder users cannot be imported until a phone-login module exists or they add an email. Name and email copies in the apps are eventually consistent.
