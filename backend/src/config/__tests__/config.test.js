import { parseEnv } from '../env.js';

const valid = {
  DB_USER: 'app',
  DB_NAME: 'central_auth',
  JWT_ACCESS_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
};

describe('parseEnv', () => {
  test('applies defaults and splits CORS origins', () => {
    const env = parseEnv({
      ...valid,
      CORS_ORIGINS: 'https://a.example.com, http://localhost:3000',
    });

    expect(env.PORT).toBe(5000);
    expect(env.DB_NAME_TEST).toBe('central_auth_test');
    expect(env.CORS_ORIGINS).toEqual(['https://a.example.com', 'http://localhost:3000']);
  });

  test.each([
    ['a missing secret', { JWT_ACCESS_SECRET: undefined }, 'JWT_ACCESS_SECRET is required'],
    ['a short secret', { JWT_ACCESS_SECRET: 'short' }, 'at least 32 characters'],
    ['identical secrets', { JWT_REFRESH_SECRET: 'a'.repeat(32) }, 'must be different'],
    ['a bad duration', { JWT_ACCESS_EXPIRES_IN: 'soon' }, 'must look like'],
    ['a wildcard origin', { CORS_ORIGINS: '*' }, 'CORS_ORIGINS must be'],
    ['a test database without the suffix', { DB_NAME_TEST: 'central_auth' }, 'must end with _test'],
  ])('rejects %s', (_name, overrides, message) => {
    expect(() => parseEnv({ ...valid, ...overrides })).toThrow(message);
  });

  test('does not put secret values in the error', () => {
    expect(() => parseEnv({ ...valid, JWT_ACCESS_SECRET: 'shortsecret' })).not.toThrow(
      'shortsecret',
    );
  });
});

describe('database config', () => {
  const original = process.env.DB_NAME_TEST;

  afterEach(() => {
    if (original === undefined) delete process.env.DB_NAME_TEST;
    else process.env.DB_NAME_TEST = original;
  });

  const load = () => {
    let config;
    jest.isolateModules(() => {
      config = require('../database.cjs');
    });
    return config;
  };

  test('refuses to load in tests against a database not ending in _test', () => {
    process.env.DB_NAME_TEST = 'central_auth';

    expect(load).toThrow('must end with _test');
  });

  test('uses the test database and UTC in the test environment', () => {
    process.env.DB_NAME_TEST = 'central_auth_test';

    expect(load().test).toMatchObject({
      database: 'central_auth_test',
      dialect: 'mysql',
      timezone: '+00:00',
    });
  });
});
