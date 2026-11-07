// Raw-SQL row builders for the db tests: they bypass the models on purpose, so the tests prove the
// database's own constraints. Every value is synthetic.
import { createHash, randomUUID } from 'node:crypto';
import { sequelize } from '../models/index.js';

let counter = 0;
const next = () => {
  counter += 1;
  return counter;
};

export const sha256Hex = (value) => createHash('sha256').update(String(value)).digest('hex');

// Inserts a row and returns its id. `values` keys are column names.
export async function insertRow(table, values) {
  const columns = Object.keys(values);
  const sql = `INSERT INTO \`${table}\` (${columns.map((c) => `\`${c}\``).join(', ')})
    VALUES (${columns.map(() => '?').join(', ')})`;
  const [id] = await sequelize.query(sql, {
    replacements: columns.map((c) => values[c]),
    type: sequelize.QueryTypes.INSERT,
  });
  return id;
}

export function applicationValues(overrides = {}) {
  const n = next();
  return { code: `app_${n}`, name: `App ${n}`, ...overrides };
}

export function appRoleValues(applicationId, overrides = {}) {
  const n = next();
  return { application_id: applicationId, code: `PANEL_${n}`, name: `Panel ${n}`, ...overrides };
}

export function userValues(overrides = {}) {
  const n = next();
  return {
    uuid: randomUUID(),
    email: `person${n}@example.test`,
    full_name: `Person ${n}`,
    ...overrides,
  };
}

const inMinutes = (minutes) => new Date(Date.now() + minutes * 60_000);

export function emailOtpValues(userId, overrides = {}) {
  const n = next();
  return {
    user_id: userId,
    email: `person${n}@example.test`,
    purpose: 'EMAIL_VERIFICATION',
    code_hash: sha256Hex(`code-${n}`),
    expires_at: inMinutes(10),
    ...overrides,
  };
}

export function refreshTokenValues(userId, applicationId, overrides = {}) {
  const n = next();
  return {
    user_id: userId,
    application_id: applicationId,
    token_hash: sha256Hex(`token-${n}`),
    family_id: randomUUID(),
    expires_at: inMinutes(60 * 24 * 7),
    ip_address: '203.0.113.10',
    ...overrides,
  };
}

export const insertApplication = (o) => insertRow('applications', applicationValues(o));
export const insertAppRole = (applicationId, o) =>
  insertRow('app_roles', appRoleValues(applicationId, o));
export const insertUser = (o) => insertRow('users', userValues(o));

// One application, one panel and one person, the usual starting point of a test.
export async function insertBasics() {
  const applicationId = await insertApplication();
  const appRoleId = await insertAppRole(applicationId);
  const userId = await insertUser();
  return { applicationId, appRoleId, userId };
}
