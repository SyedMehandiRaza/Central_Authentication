import {
  LIMITS,
  PATTERNS,
  APPLICATION_STATUSES,
  REGISTRATION_MODES,
  USER_STATUSES,
  USER_APP_ROLE_STATUSES,
  GRANTED_VIA,
  OTP_PURPOSES,
  REVOKED_REASONS,
  AUTH_EVENTS,
  SEED_APPLICATIONS,
  SEED_APP_ROLES,
} from '../index.js';

const ENUMS = {
  APPLICATION_STATUSES,
  REGISTRATION_MODES,
  USER_STATUSES,
  USER_APP_ROLE_STATUSES,
  GRANTED_VIA,
  OTP_PURPOSES,
  REVOKED_REASONS,
  AUTH_EVENTS,
};

describe('LIMITS', () => {
  test('the object and every group are frozen', () => {
    expect(Object.isFrozen(LIMITS)).toBe(true);
    Object.values(LIMITS).forEach((group) => expect(Object.isFrozen(group)).toBe(true));
  });

  test('every limit is a positive integer', () => {
    Object.values(LIMITS).forEach((group) =>
      Object.values(group).forEach((value) => {
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThan(0);
      }),
    );
  });

  test('values match the agreed design', () => {
    expect(LIMITS).toEqual({
      application: { codeMax: 50, nameMax: 100 },
      appRole: { codeMax: 50, nameMax: 100 },
      user: {
        emailMax: 191,
        fullNameMin: 1,
        fullNameMax: 150,
        passwordMinChars: 8,
        passwordMaxBytes: 72,
        passwordHashMax: 255,
        uuidLength: 36,
      },
      otp: { codeLength: 6, ttlSeconds: 600, maxAttempts: 5, resendWaitSeconds: 60 },
      refreshToken: { familyIdLength: 36 },
      login: { maxFailedAttempts: 5, lockSeconds: 900 },
      hash: { sha256HexLength: 64 },
      network: { ipAddressMax: 45, userAgentMax: 255 },
      retention: { refreshTokenDays: 30, otpDays: 7, authEventMonths: 12 },
    });
  });

  test('min/max pairs are ordered', () => {
    expect(LIMITS.user.fullNameMin).toBeLessThanOrEqual(LIMITS.user.fullNameMax);
    expect(LIMITS.user.passwordMinChars).toBeLessThanOrEqual(LIMITS.user.passwordMaxBytes);
  });
});

describe('PATTERNS', () => {
  test('is frozen and every pattern compiles', () => {
    expect(Object.isFrozen(PATTERNS)).toBe(true);
    Object.values(PATTERNS).forEach((p) => expect(() => new RegExp(p)).not.toThrow());
  });

  test.each([
    ['uuid', '3f2b8c1e-9a4d-4e2f-8b1a-0c9d8e7f6a5b', true],
    ['uuid', '3F2B8C1E-9A4D-4E2F-8B1A-0C9D8E7F6A5B', false],
    ['uuid', '3f2b8c1e9a4d4e2f8b1a0c9d8e7f6a5b', false],
    ['sha256Hex', 'a'.repeat(64), true],
    ['sha256Hex', 'A'.repeat(64), false],
    ['sha256Hex', 'a'.repeat(63), false],
    ['applicationCode', 'real_estate', true],
    ['applicationCode', 'Real_estate', false],
    ['applicationCode', '1app', false],
    ['appRoleCode', 'HIRING_MANAGER', true],
    ['appRoleCode', 'Seeker', false],
    ['appRoleCode', '_ADMIN', false],
  ])('%s matches %s: %s', (name, value, expected) => {
    expect(new RegExp(PATTERNS[name]).test(value)).toBe(expected);
  });

  test('uuid and hash patterns fix the column lengths', () => {
    expect(PATTERNS.uuid).toContain('{12}');
    expect(LIMITS.user.uuidLength).toBe(LIMITS.refreshToken.familyIdLength);
    expect(PATTERNS.sha256Hex).toContain(`{${LIMITS.hash.sha256HexLength}}`);
  });
});

describe('enums', () => {
  test.each(Object.entries(ENUMS))('%s is frozen with unique values', (_, values) => {
    expect(Object.isFrozen(values)).toBe(true);
    expect(new Set(values).size).toBe(values.length);
  });

  test('values are exact and in DB order', () => {
    expect(ENUMS).toEqual({
      APPLICATION_STATUSES: ['ACTIVE', 'DISABLED'],
      REGISTRATION_MODES: ['OPEN', 'INVITE_ONLY'],
      USER_STATUSES: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED'],
      USER_APP_ROLE_STATUSES: ['PENDING', 'ACTIVE', 'REVOKED'],
      GRANTED_VIA: ['SELF_SIGNUP', 'APP', 'ADMIN', 'MIGRATION'],
      OTP_PURPOSES: ['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'ACCOUNT_SETUP'],
      REVOKED_REASONS: [
        'LOGOUT',
        'ROTATED',
        'REUSE_DETECTED',
        'PASSWORD_CHANGED',
        'ROLE_REVOKED',
        'ADMIN',
      ],
      AUTH_EVENTS: [
        'REGISTERED',
        'OTP_SENT',
        'EMAIL_VERIFIED',
        'LOGIN_SUCCEEDED',
        'LOGIN_FAILED',
        'ACCOUNT_LOCKED',
        'PASSWORD_RESET',
        'PASSWORD_CHANGED',
        'LOGOUT',
        'ROLE_GRANTED',
        'ROLE_REVOKED',
        'TOKEN_REUSE_DETECTED',
      ],
    });
  });
});

describe('SEED_APPLICATIONS', () => {
  test('lists fyinder and real_estate, frozen', () => {
    expect(Object.isFrozen(SEED_APPLICATIONS)).toBe(true);
    SEED_APPLICATIONS.forEach((row) => expect(Object.isFrozen(row)).toBe(true));
    expect(SEED_APPLICATIONS).toEqual([
      { code: 'fyinder', name: 'Fyinder' },
      { code: 'real_estate', name: 'Real Estate' },
    ]);
  });

  test.each(SEED_APPLICATIONS)('$code fits the code format and limits', ({ code, name }) => {
    expect(new RegExp(PATTERNS.applicationCode).test(code)).toBe(true);
    expect(code.length).toBeLessThanOrEqual(LIMITS.application.codeMax);
    expect(name.length).toBeGreaterThan(0);
    expect(name.length).toBeLessThanOrEqual(LIMITS.application.nameMax);
  });
});

describe('SEED_APP_ROLES', () => {
  const modes = (app) =>
    Object.fromEntries(
      SEED_APP_ROLES.filter((r) => r.applicationCode === app).map((r) => [
        r.code,
        r.registrationMode,
      ]),
    );

  test('has 18 frozen panels with no duplicate (application, code)', () => {
    expect(Object.isFrozen(SEED_APP_ROLES)).toBe(true);
    SEED_APP_ROLES.forEach((row) => expect(Object.isFrozen(row)).toBe(true));
    expect(SEED_APP_ROLES).toHaveLength(18);
    const keys = SEED_APP_ROLES.map((r) => `${r.applicationCode}:${r.code}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  test('fyinder panels have the agreed registration modes', () => {
    expect(modes('fyinder')).toEqual({
      SEEKER: 'OPEN',
      EMPLOYER: 'OPEN',
      HIRING_MANAGER: 'INVITE_ONLY',
      COMPANY_USER: 'INVITE_ONLY',
      HRMS_EMPLOYEE: 'INVITE_ONLY',
      CONSULTANT: 'OPEN',
      UNIVERSITY: 'OPEN',
      AGENT: 'OPEN',
      ADMIN: 'INVITE_ONLY',
    });
  });

  test('real_estate panels have the agreed registration modes', () => {
    expect(modes('real_estate')).toEqual({
      BUYER: 'OPEN',
      OWNER: 'OPEN',
      DEVELOPER: 'OPEN',
      AGENT: 'OPEN',
      TENANT: 'INVITE_ONLY',
      FACILITY_ADMIN: 'INVITE_ONLY',
      TECHNICIAN: 'INVITE_ONLY',
      STAFF: 'INVITE_ONLY',
      ADMIN: 'INVITE_ONLY',
    });
  });

  test.each(SEED_APP_ROLES)(
    '$applicationCode $code is valid against the DB rules',
    ({ applicationCode, code, name, registrationMode }) => {
      expect(SEED_APPLICATIONS.map((a) => a.code)).toContain(applicationCode);
      expect(new RegExp(PATTERNS.appRoleCode).test(code)).toBe(true);
      expect(code.length).toBeLessThanOrEqual(LIMITS.appRole.codeMax);
      expect(name.length).toBeGreaterThan(0);
      expect(name.length).toBeLessThanOrEqual(LIMITS.appRole.nameMax);
      expect(REGISTRATION_MODES).toContain(registrationMode);
    },
  );
});
