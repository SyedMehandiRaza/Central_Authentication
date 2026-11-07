import { commonMessages, ERROR_CODES } from '@app/shared';
import { AppError } from '../utils/AppError.js';

const FORM_LEVEL_FIELD = '_form';

function addIssue(fields, path, message) {
  const key = path.join('.') || FORM_LEVEL_FIELD;
  (fields[key] ??= []).push(message);
}

function collectFields(issues, fields) {
  for (const issue of issues) {
    if (issue.code === 'unrecognized_keys') {
      for (const key of issue.keys) {
        addIssue(fields, [...issue.path, key], commonMessages.unknownField);
      }
    } else {
      addIssue(fields, issue.path, issue.message);
    }
  }
}

export function validate(schemas) {
  return (req, res, next) => {
    // No prototype: field names come from the client and may be "__proto__".
    const fields = Object.create(null);
    const validated = {};

    for (const [source, schema] of Object.entries(schemas)) {
      const result = schema.safeParse(req[source] ?? {});
      if (result.success) validated[source] = result.data;
      else collectFields(result.error.issues, fields);
    }

    if (Object.keys(fields).length > 0) {
      return next(new AppError(ERROR_CODES.VALIDATION_ERROR, { fields }));
    }

    req.validated = validated;
    return next();
  };
}
