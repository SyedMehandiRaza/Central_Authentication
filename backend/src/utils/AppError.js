import { ERRORS } from '@app/shared';

export class AppError extends Error {
  constructor(code, { message, fields, cause } = {}) {
    const definition = ERRORS[code];
    if (!definition) throw new TypeError(`Unknown error code: ${code}`);

    super(message ?? definition.message, { cause });
    this.name = 'AppError';
    this.code = code;
    this.status = definition.status;
    this.fields = fields;
  }
}
