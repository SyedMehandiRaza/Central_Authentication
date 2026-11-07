# Auth: execution board

Prefix `AUTH`. Branch `feature/auth`. Spec: [docs/modules/auth/README.md](../../modules/auth/README.md). Database: [db.md](../../modules/auth/db.md). Rules: [issue-tracker.md](../../agents/issue-tracker.md).

## Tickets

Tickets are written at stage 5 (`/to-tickets`), after the API contract.

| ID  | Title | Status | Blocked by |
| --- | ----- | ------ | ---------- |

## Open questions

| ID  | Question | Blocks |
| --- | -------- | ------ |

## Decisions

| ID                                                                  | Decision                                                                 |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [AUTH-DEC-001](decisions/AUTH-DEC-001-deletion-rules.md)              | Persons are not deleted; FKs restrict except sessions, codes and logs   |
| [AUTH-DEC-002](decisions/AUTH-DEC-002-exact-email-collation.md)       | Email columns use an exact (binary) collation                            |
| [AUTH-DEC-003](decisions/AUTH-DEC-003-session-per-application.md)     | A session is one login into one application                              |
| [AUTH-DEC-004](decisions/AUTH-DEC-004-panel-access-regrant.md)        | Re-granting a revoked panel reuses the same row                          |
| [AUTH-DEC-005](decisions/AUTH-DEC-005-active-requires-verified-email.md) | An ACTIVE person must have a verified email; a name is required       |
| [AUTH-DEC-006](decisions/AUTH-DEC-006-profile-version-model-hook.md)  | profile_version is increased by a model hook, not a DB trigger           |
| [AUTH-DEC-007](decisions/AUTH-DEC-007-unknown-email-hmac.md)          | Failed logins for unknown emails store only an HMAC of the email         |
| [AUTH-DEC-008](decisions/AUTH-DEC-008-limits-and-retention.md)        | Password, code, lock and retention numbers                               |
