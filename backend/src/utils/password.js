import bcrypt from 'bcryptjs';

const COST = 12;

// bcrypt only uses the first 72 bytes, so the shared password schema must limit length accordingly.
export function hashPassword(password) {
  return bcrypt.hash(password, COST);
}

export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
