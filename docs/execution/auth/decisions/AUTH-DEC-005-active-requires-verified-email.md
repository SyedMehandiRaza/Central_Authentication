# AUTH-DEC-005: An ACTIVE person must have a verified email; a name is required

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q8)
- **Tickets:** none yet

## Decision

`CHECK (status <> 'ACTIVE' OR email_verified_at IS NOT NULL)`. `full_name` is NOT NULL, 1 to 150 characters; an inviting application must send a name. Imported persons with unverified emails stay PENDING and verify by code on first login.

## Why

Login is by email, so an unverified address must never be able to log in.

## Alternatives rejected

- Application-only check: the DB would accept inconsistent rows from bulk scripts or imports.
