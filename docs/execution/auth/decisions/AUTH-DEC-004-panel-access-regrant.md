# AUTH-DEC-004: Re-granting a revoked panel reuses the same row

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q7)
- **Tickets:** none yet

## Decision

`UNIQUE(user_id, app_role_id)`. Re-granting sets `status = 'ACTIVE'` and clears `revoked_at`. A CHECK keeps `status = 'REVOKED'` and `revoked_at IS NOT NULL` equivalent. History is in `auth_events` (ROLE_GRANTED, ROLE_REVOKED). PENDING means invited or requested; only ACTIVE grants entry.

## Why

One row per person and panel keeps lookups simple and the unique key meaningful.

## Alternatives rejected

- A new row per grant: needs a partial unique index, which MySQL lacks.
