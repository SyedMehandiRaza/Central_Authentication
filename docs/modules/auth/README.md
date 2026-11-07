# Auth

Status: stage 3 (Database) of `/new-module`. No API endpoints yet. Tracker: [docs/execution/auth/](../../execution/auth/). Decision: [DEC-002](../../DECISIONS.md). Terms: [GLOSSARY.md](../../../GLOSSARY.md).

## Purpose and users

One person (one email, one password) logs in to every panel of every connected application. This module owns identity (email, password, email verification, name, account status) and panel access. Each application keeps its own profiles, companies and fine-grained permissions, and links to the person through `users.uuid`.

Example: ali@x.com is a fyinder SEEKER, a fyinder UNIVERSITY member and a real_estate BUYER, all with the same login.

Users of this module:

- **Persons**: sign up, verify their email, log in, reset their password.
- **Applications** (backend to backend): invite persons into invite-only panels, grant and revoke panel access. Authenticated by a client secret whose hash is stored in `applications.client_secret_hash` (set later, never seeded).
- **Administrators**: grant and revoke panel access, suspend or block persons (the admin interface is a later module).

## Scope

### In scope (whole module)

- Email + password login, email verification by a 6-digit one-time code, password reset, account setup for invited persons.
- Panel access per application, including open and invite-only panels.
- Sessions (refresh tokens) per application, with rotation and reuse detection.
- A security event log.

### In scope now (this stage)

- The database layer only: migrations, models, seeders for applications and panels, and DB-level tests.

### Out of scope

- API endpoints (later stages of this module).
- Projects, project links, outbox/events for name sync (later modules).
- Phone login, Google/Apple login.
- Importing existing fyinder and real_estate users (later; the schema must not block it).
- The construction application (added later as data, not seeded now).

## Applications and panels (seeded configuration)

| Application   | Panel code     | Registration mode |
| ------------- | -------------- | ----------------- |
| `fyinder`     | SEEKER         | OPEN              |
| `fyinder`     | EMPLOYER       | OPEN              |
| `fyinder`     | HIRING_MANAGER | INVITE_ONLY       |
| `fyinder`     | COMPANY_USER   | INVITE_ONLY       |
| `fyinder`     | HRMS_EMPLOYEE  | INVITE_ONLY       |
| `fyinder`     | CONSULTANT     | OPEN              |
| `fyinder`     | UNIVERSITY     | OPEN              |
| `fyinder`     | AGENT          | OPEN              |
| `fyinder`     | ADMIN          | INVITE_ONLY       |
| `real_estate` | BUYER          | OPEN              |
| `real_estate` | OWNER          | OPEN              |
| `real_estate` | DEVELOPER      | OPEN              |
| `real_estate` | AGENT          | OPEN              |
| `real_estate` | TENANT         | INVITE_ONLY       |
| `real_estate` | FACILITY_ADMIN | INVITE_ONLY       |
| `real_estate` | TECHNICIAN     | INVITE_ONLY       |
| `real_estate` | STAFF          | INVITE_ONLY       |
| `real_estate` | ADMIN          | INVITE_ONLY       |

The real_estate codes match its existing `roles.name` values in upper case. The fyinder codes are the panels named by the user (2026-11-07).

## User workflows (planned; built in later stages)

1. Sign up into an open panel: person created as PENDING with panel access PENDING, one-time code sent, email verified, then both become ACTIVE.
2. Invited into an invite-only panel: an application creates the person (no password, PENDING) and the panel access, an account setup code is sent, the person sets a password.
3. Log in to an application: email + password, then one session for that application. The access token lists the person's active panels in that application.
4. Refresh: the refresh token is rotated on every use. Reusing an old token revokes the whole token family.
5. Password reset or change: revokes every session of the person in every application.

## Business rules (confirmed 2026-11-07)

- One person per email. Emails are stored lowercase and compared exactly (accented addresses are different addresses).
- Passwords: 8 to 72 bytes (the bcrypt limit). Only the hash is stored, and only here.
- One-time codes: 6 digits, valid 10 minutes, 5 wrong attempts, 60 seconds before a new code can be sent. Only an HMAC-SHA256 of the code is stored.
- Person status: PENDING (email not verified yet), ACTIVE (can log in), SUSPENDED, BLOCKED. A person cannot be ACTIVE without a verified email.
- A person with no password is an invited person.
- Panel access status: PENDING (invited or requested, not usable yet), ACTIVE (may enter), REVOKED. Only ACTIVE grants entry. Revoking and granting again reuses the same row; the history is in the security events.
- A session belongs to one application, not one panel.
- A password change or reset revokes all sessions of the person in all applications.
- `profile_version` goes up on every change to the name or email.
- No self-delete of persons for now. Applications and panels are disabled, never deleted.
- Failed logins for an unknown email record only an HMAC of the email, never the email itself.

## Assumptions (reversible, labeled)

- Account lock after 5 failed logins, for 15 minutes.
- Retention: expired or revoked sessions deleted after 30 days, consumed or expired one-time codes after 7 days, security events after 12 months. Purge jobs are built later. To be confirmed by the user or legal.

## Data

- Tables: `applications`, `app_roles`, `users`, `user_app_roles`, `email_otps`, `refresh_tokens`, `auth_events`. Details: [db.md](db.md).
- Data owner: this service owns all of them.
- Sensitive data: email, name, IP address and user agent are personal data; password, one-time code and token values are stored only as hashes. See db.md.

## Interfaces

- API/events: not defined yet (stage 4, Contract).
- Shared constants: string lengths in `shared/src/limits.js`, enum values in `shared/src/enums.js`, used by migrations, models and the future Zod schemas.

## Dependencies

- Backend foundation (DEC-001): JWT and password utilities, `hashToken`.

## Acceptance criteria (this stage)

- [ ] Seven migrations, one per table, in FK order, each with a working `down`.
- [ ] Models match the migrations, with `underscored: true` and a default scope that hides `password_hash`, `code_hash`, `token_hash` and `client_secret_hash`.
- [ ] Seeders create the 2 applications and 18 panels, and running them twice does not duplicate rows.
- [ ] Every UNIQUE, FK (including ON DELETE behaviour), CHECK and ENUM constraint is proven by a test that attempts an invalid insert, against `central_auth_test` only.
- [ ] `profile_version` goes up on name or email changes (tested).
- [ ] An opt-in migration round-trip test exists.
- [ ] `npm run check` passes.

## Tests and verification

- `shared/`: limits and enums are frozen and consistent.
- `backend/`: DB integration tests in `backend/src/modules/auth/__tests__/` against the `_test` database, migrated by a Jest globalSetup.

## Open questions and assumptions

- Retention periods and lock threshold above are assumptions.
- How applications verify access tokens (HS256 shared secret vs RS256 public key) is still open in `docs/REQUIREMENTS.md`; it does not affect the schema.
