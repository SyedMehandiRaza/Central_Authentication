// Numeric limits shared by migrations, models and Zod schemas.
// A Zod `max` must never exceed the matching DB column length.
// Source: docs/modules/auth/README.md, AUTH-DEC-005, AUTH-DEC-008.

const deepFreeze = (object) => {
  Object.values(object).forEach((value) => {
    if (value && typeof value === 'object') deepFreeze(value);
  });
  return Object.freeze(object);
};

export const LIMITS = deepFreeze({
  // applications: one row per connected product (fyinder, real_estate)
  application: {
    codeMax: 50,
    nameMax: 100,
  },
  // app_roles: panels inside an application
  appRole: {
    codeMax: 50,
    nameMax: 100,
  },
  // users: one row per person. Passwords are 8 to 72 bytes (bcrypt ignores bytes after 72).
  user: {
    emailMax: 191,
    fullNameMin: 1,
    fullNameMax: 150,
    passwordMinChars: 8,
    passwordMaxBytes: 72,
    passwordHashMax: 255,
    uuidLength: 36,
  },
  // email_otps: 6-digit one-time codes
  otp: {
    codeLength: 6,
    ttlSeconds: 600,
    maxAttempts: 5,
    resendWaitSeconds: 60,
  },
  // refresh_tokens: token family id is a canonical UUID
  refreshToken: {
    familyIdLength: 36,
  },
  // Account lock after failed logins (assumption, AUTH-DEC-008)
  login: {
    maxFailedAttempts: 5,
    lockSeconds: 900,
  },
  // Stored hashes: SHA-256 / HMAC-SHA256 as lowercase hex
  hash: {
    sha256HexLength: 64,
  },
  // ip_address fits an IPv6 text form; user_agent is truncated to this length
  network: {
    ipAddressMax: 45,
    userAgentMax: 255,
  },
  // Purge periods (assumption, AUTH-DEC-008; purge jobs come later)
  retention: {
    refreshTokenDays: 30,
    otpDays: 7,
    authEventMonths: 12,
  },
});

// Format patterns as strings, so the same text can be used in MySQL CHECK
// constraints (REGEXP_LIKE(col, pattern, 'c'), case-sensitive) and in JS (new RegExp(pattern)).
export const PATTERNS = Object.freeze({
  applicationCode: '^[a-z][a-z0-9_]*$',
  appRoleCode: '^[A-Z][A-Z0-9_]*$',
  uuid: '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$',
  sha256Hex: '^[0-9a-f]{64}$',
});
