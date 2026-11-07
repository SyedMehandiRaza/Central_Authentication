// The one place that decides which database the db tests may touch.
const TEST_SUFFIX = /_test$/;

export function assertTestDatabase(name) {
  if (typeof name !== 'string' || !TEST_SUFFIX.test(name)) {
    throw new Error(
      `Refusing to run database tests: the database name must end with _test (got "${name}")`,
    );
  }
  return name;
}
