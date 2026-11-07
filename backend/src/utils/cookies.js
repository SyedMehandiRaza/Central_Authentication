import { env } from '../config/env.js';

export const REFRESH_COOKIE_NAME = 'refresh_token';

// Call without expiresAt for res.clearCookie, which needs the same path and flags.
export function refreshCookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth',
    ...(expiresAt && { expires: expiresAt }),
  };
}
