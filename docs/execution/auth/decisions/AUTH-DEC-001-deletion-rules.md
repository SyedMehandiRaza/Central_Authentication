# AUTH-DEC-001: Persons are not deleted; FKs restrict except sessions, codes and logs

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q4)
- **Tickets:** none yet

## Decision

FKs to `users`: RESTRICT, except `email_otps.user_id` and `refresh_tokens.user_id` (CASCADE) and `auth_events.user_id`, `user_app_roles.granted_by_user_id` (SET NULL). Applications and panels are disabled, never deleted: `app_roles.application_id`, `user_app_roles.app_role_id`, `refresh_tokens.application_id` are RESTRICT; `auth_events.application_id` is SET NULL. Every ON UPDATE is CASCADE.

## Why

No self-delete exists yet. RESTRICT stops an accidental delete from silently removing panel access, while short-lived rows (codes, sessions) follow the person.

## Alternatives rejected

- Soft delete (`paranoid`): not a confirmed requirement.
