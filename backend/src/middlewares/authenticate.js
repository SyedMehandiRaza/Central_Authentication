import { ERROR_CODES } from '@app/shared';
import { AppError } from '../utils/AppError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new AppError(ERROR_CODES.UNAUTHORIZED));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, roles: payload.roles ?? [] };
    return next();
  } catch (cause) {
    return next(new AppError(ERROR_CODES.UNAUTHORIZED, { cause }));
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError(ERROR_CODES.UNAUTHORIZED));

    const isAllowed = req.user.roles.some((role) => allowedRoles.includes(role));
    return next(isAllowed ? undefined : new AppError(ERROR_CODES.FORBIDDEN));
  };
}
