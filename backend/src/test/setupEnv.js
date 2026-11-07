// Runs before each test file, so tests never need a real .env. Values already set here win over .env.
import { randomBytes } from 'node:crypto';

process.env.NODE_ENV = 'test';
process.env.LOG_LEVEL = 'silent';
process.env.CORS_ORIGINS = 'http://allowed.test';
process.env.DB_USER ??= 'test_user';
process.env.DB_NAME ??= 'central_auth_test';
process.env.JWT_ACCESS_SECRET = randomBytes(32).toString('hex');
process.env.JWT_REFRESH_SECRET = randomBytes(32).toString('hex');
process.env.JWT_ACCESS_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';
