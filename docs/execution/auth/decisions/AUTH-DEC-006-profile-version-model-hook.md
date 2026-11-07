# AUTH-DEC-006: profile_version is increased by a model hook, not a DB trigger

- **Status:** accepted (user, 2026-11-07)
- **Answers:** none (grill Q10)
- **Tickets:** none yet

## Decision

The `User` model's `beforeUpdate` hook adds 1 to `profile_version` when `full_name` or `email` changed. Raw SQL or bulk updates of those columns must increase it themselves.

## Why

Triggers are invisible in model code and reviews. The counter lets applications ignore out-of-date name/email events (DEC-002).

## Alternatives rejected

- MySQL trigger: hidden logic, harder to test and migrate.
