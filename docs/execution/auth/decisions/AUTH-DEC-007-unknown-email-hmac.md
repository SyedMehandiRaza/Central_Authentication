# AUTH-DEC-007: Failed logins for unknown emails store only an HMAC of the email

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q11)
- **Tickets:** none yet

## Decision

`auth_events` LOGIN_FAILED rows with no matching person have `user_id = NULL` and `metadata = { "email_hmac": "<HMAC-SHA256 hex>" }`. The plain email is never stored. The HMAC key is a future environment variable.

## Why

Repeated attacks on one address stay visible without storing someone else's email.

## Alternatives rejected

- Plain email in metadata: personal data of possibly unrelated people.
- Nothing: loses the attack signal.
