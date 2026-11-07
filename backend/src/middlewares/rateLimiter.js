import { ERROR_CODES } from '@app/shared';
import { rateLimit } from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

// Starting values, to be confirmed in the auth module. In-memory, so counts are per process.
export function createAuthRateLimiter({ windowMs = 15 * 60 * 1000, limit = 20 } = {}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res, next) => next(new AppError(ERROR_CODES.RATE_LIMITED)),
  });
}
