import { ERROR_CODES } from '@app/shared';
import { AppError } from '../utils/AppError.js';

export function notFound(req, res, next) {
  next(new AppError(ERROR_CODES.NOT_FOUND));
}
