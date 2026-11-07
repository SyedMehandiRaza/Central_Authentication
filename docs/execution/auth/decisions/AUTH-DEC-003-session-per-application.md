# AUTH-DEC-003: A session is one login into one application

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q6)
- **Tickets:** none yet

## Decision

`refresh_tokens` has `application_id` and no panel column. Switching panels inside one application needs no new login; the access token lists the person's active panels in that application.

## Why

A person such as a fyinder SEEKER and UNIVERSITY member uses one application; a session per panel would force extra logins.

## Alternatives rejected

- Session per panel: more logins, more rows, no security gain (panel access is re-checked on refresh).
