import { commonMessages as m } from '../messages/common.messages.js';

export const ERROR_CODES = Object.freeze({
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  PAYLOAD_TOO_LARGE: 'PAYLOAD_TOO_LARGE',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  RATE_LIMITED: 'RATE_LIMITED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
});

export const ERRORS = Object.freeze({
  BAD_REQUEST: { status: 400, message: m.badRequest },
  UNAUTHORIZED: { status: 401, message: m.unauthorized },
  FORBIDDEN: { status: 403, message: m.forbidden },
  NOT_FOUND: { status: 404, message: m.notFound },
  CONFLICT: { status: 409, message: m.conflict },
  PAYLOAD_TOO_LARGE: { status: 413, message: m.payloadTooLarge },
  VALIDATION_ERROR: { status: 422, message: m.invalidInput },
  RATE_LIMITED: { status: 429, message: m.rateLimited },
  INTERNAL_ERROR: { status: 500, message: m.internalError },
});
