import { assertTestDatabase } from '../testDatabase.js';

describe('assertTestDatabase', () => {
  test('accepts a database name ending in _test', () => {
    expect(assertTestDatabase('central_auth_test')).toBe('central_auth_test');
  });

  test.each([['central_auth'], ['central_auth_test_copy'], ['test'], [''], [undefined]])(
    'refuses %p',
    (name) => {
      expect(() => assertTestDatabase(name)).toThrow('must end with _test');
    },
  );
});
