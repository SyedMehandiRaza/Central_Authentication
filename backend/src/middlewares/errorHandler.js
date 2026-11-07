import { ERROR_CODES } from '@app/shared';
import { AppError } from '../utils/AppError.js';
import { logger } from '../utils/logger.js';

function toAppError(err) {
  if (err instanceof AppError) return err;
  if (err.type === 'entity.parse.failed') return new AppError(ERROR_CODES.BAD_REQUEST);
  if (err.type === 'entity.too.large') return new AppError(ERROR_CODES.PAYLOAD_TOO_LARGE);
  if (err.name === 'SequelizeUniqueConstraintError') return new AppError(ERROR_CODES.CONFLICT);
  return new AppError(ERROR_CODES.INTERNAL_ERROR);
}

// Express identifies error middleware by its four parameters.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const appError = toAppError(err);

  if (appError.status >= 500) {
    // Log selected properties only: database errors also carry SQL and bound parameters.
    logger.error(
      { errorName: err.name, stack: err.stack, method: req.method, path: req.path },
      err.message,
    );
  }

  return res.status(appError.status).json({
    success: false,
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.fields && { fields: appError.fields }),
    },
  });
}
