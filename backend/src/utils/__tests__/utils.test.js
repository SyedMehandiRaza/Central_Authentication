import { hashToken, signRefreshToken, verifyAccessToken, verifyRefreshToken } from '../jwt.js';
import { refreshCookieOptions, REFRESH_COOKIE_NAME } from '../cookies.js';
import { assertSupportedMysqlVersion } from '../mysqlVersion.js';
import { hashPassword, verifyPassword } from '../password.js';

describe('signRefreshToken', () => {
  test('returns a verifiable token with its jti and expiry', () => {
    const { token, jti, expiresAt } = signRefreshToken({ userId: 7 });
    const payload = verifyRefreshToken(token);

    expect(payload.sub).toBe('7');
    expect(payload.jti).toBe(jti);
    expect(expiresAt.getTime()).toBe(payload.exp * 1000);
  });

  test('gives each token its own jti', () => {
    expect(signRefreshToken({ userId: 7 }).jti).not.toBe(signRefreshToken({ userId: 7 }).jti);
  });

  test('is not accepted by the access token verifier', () => {
    const { token } = signRefreshToken({ userId: 7 });

    expect(() => verifyAccessToken(token)).toThrow();
  });
});

describe('hashToken', () => {
  test('is deterministic and does not contain the token', () => {
    const hash = hashToken('some-token');

    expect(hash).toBe(hashToken('some-token'));
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain('some-token');
  });
});

describe('password', () => {
  test('verifies the right password and rejects a wrong one', async () => {
    const hash = await hashPassword('correct horse');

    expect(hash).not.toContain('correct horse');
    await expect(verifyPassword('correct horse', hash)).resolves.toBe(true);
    await expect(verifyPassword('wrong', hash)).resolves.toBe(false);
  });
});

describe('refreshCookieOptions', () => {
  test('is httpOnly, scoped to /api/auth and expires with the token', () => {
    const expiresAt = new Date('2030-01-01T00:00:00Z');

    expect(REFRESH_COOKIE_NAME).toBe('refresh_token');
    expect(refreshCookieOptions(expiresAt)).toMatchObject({
      httpOnly: true,
      path: '/api/auth',
      expires: expiresAt,
    });
  });
});

describe('assertSupportedMysqlVersion', () => {
  test.each(['8.0.16', '8.0.40', '8.4.9', '9.1.0', '8.4.9-log'])('accepts %s', (version) => {
    expect(() => assertSupportedMysqlVersion(version)).not.toThrow();
  });

  test.each(['8.0.15', '5.7.44', '10.4.32-MariaDB', 'unknown'])('rejects %s', (version) => {
    expect(() => assertSupportedMysqlVersion(version)).toThrow('MySQL 8.0.16 or newer');
  });
});
