import { ERROR_CODES, ERRORS } from '../../index.js';

describe('error codes', () => {
  test.each(Object.values(ERROR_CODES))('%s has an HTTP status and a message', (code) => {
    expect(ERRORS[code].status).toBeGreaterThanOrEqual(400);
    expect(ERRORS[code].message).toEqual(expect.any(String));
  });

  test('every error definition has a matching code', () => {
    expect(Object.keys(ERRORS).sort()).toEqual(Object.keys(ERROR_CODES).sort());
  });
});
