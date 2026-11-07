// Helpers for the db test project. Import only from *.db.test.js files.
import { sequelize } from '../models/index.js';
import { assertTestDatabase } from './testDatabase.js';

// Children before parents, so a plain DELETE never hits a foreign key.
export const TABLES_CHILD_FIRST = Object.freeze([
  'auth_events',
  'refresh_tokens',
  'email_otps',
  'user_app_roles',
  'users',
  'app_roles',
  'applications',
]);

export async function cleanTables() {
  assertTestDatabase(sequelize.getDatabaseName());
  for (const table of TABLES_CHILD_FIRST) {
    await sequelize.query(`DELETE FROM \`${table}\``);
  }
}

export async function closeDb() {
  await sequelize.close();
}

// Runs a parameterized query; returns the rows of a SELECT.
export async function query(sql, replacements = []) {
  const [rows] = await sequelize.query(sql, { replacements });
  return rows;
}

// Runs a callback and returns the MySQL error it raised (or fails if it did not raise).
export async function dbError(callback) {
  try {
    await callback();
  } catch (error) {
    return error.original ?? error.parent ?? error;
  }
  throw new Error('Expected the database to reject the statement, but it succeeded');
}

export { sequelize };
