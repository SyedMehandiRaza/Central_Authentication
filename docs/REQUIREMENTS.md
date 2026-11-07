# Requirements

Project-wide requirements. Module requirements go in `docs/modules/<module>/README.md`.

## Confirmed requirements

- The project is a backend-only central authentication service, with no frontend (user, 2026-11-05)
- It uses JWT, Zod, Sequelize with migrations and seeders inside `src`, and MySQL (user, 2026-11-05)

## Assumptions

All of these are reversible and live in one place in the code.

- Access tokens are signed with HS256 and carry `sub` and `roles`.
- The refresh cookie uses `SameSite=Strict`, and `Secure` in production.
- Auth routes allow 20 requests per 15 minutes per IP as a starting value.
- `shared/` stays as a workspace even without a frontend (DEC-001).

## Open questions

- How do other applications verify access tokens? With HS256, every application that verifies a token holds the signing secret and could forge tokens. RS256 with a published public key avoids that.
- Which applications use this service, and are any browser apps on a different site? That decides `SameSite` and `CORS_ORIGINS`.
- What are the user fields, the roles, the password policy, and the sign-up and reset flows? These belong in the auth module spec.

## Non-functional requirements

- Performance: [target]
- Security and privacy: [target]
