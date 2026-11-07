# AUTH-DEC-008: Password, code, lock and retention numbers

- **Status:** accepted (user, 2026-11-07); lock and retention are assumptions
- **Answers:** none (grill Q12, Q13)
- **Tickets:** none yet

## Decision

- Password 8 to 72 bytes. One-time code: 6 digits, 10 minutes, 5 attempts, 60 seconds resend wait.
- Assumption: lock after 5 failed logins for 15 minutes.
- Assumption: delete expired or revoked sessions after 30 days, consumed or expired codes after 7 days, security events after 12 months (purge jobs later). Indexes `refresh_tokens(expires_at)`, `email_otps(expires_at)`, `auth_events(created_at)` support the purges.
- All numbers live in `shared/src/limits.js`.

## Why

bcrypt ignores bytes after 72. The retention periods limit stored IP addresses and user agents.

## Alternatives rejected

- None discussed; the user accepted the defaults.
