# AUTH-DEC-002: Email columns use an exact (binary) collation

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q5)
- **Tickets:** none yet

## Decision

`users.email` and `email_otps.email` use `utf8mb4_bin`. Emails are lowercased before storage (shared Zod and the model setter), so comparisons are exact.

## Why

The default `utf8mb4_0900_ai_ci` is accent-insensitive: `jose@x.com` and `josé@x.com` would clash in the unique index although they are different mailboxes.

## Alternatives rejected

- Default collation: false duplicates for accented addresses.
