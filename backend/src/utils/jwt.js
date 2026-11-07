import { createHash, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const ALGORITHM = 'HS256';

export function signAccessToken({ userId, roles = [] }) {
  return jwt.sign({ roles }, env.JWT_ACCESS_SECRET, {
    algorithm: ALGORITHM,
    subject: String(userId),
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: [ALGORITHM] });
}

export function signRefreshToken({ userId }) {
  const jti = randomUUID();
  const token = jwt.sign({}, env.JWT_REFRESH_SECRET, {
    algorithm: ALGORITHM,
    subject: String(userId),
    jwtid: jti,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  const { exp } = jwt.decode(token);
  return { token, jti, expiresAt: new Date(exp * 1000) };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: [ALGORITHM] });
}

// Only this hash is stored in the database, never the refresh token itself.
export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}
