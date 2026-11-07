// db project globalSetup: create (if missing) and migrate the `_test` database once per run.
// Refuses any database whose name does not end with _test.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import dotenv from 'dotenv';
import { assertTestDatabase } from './testDatabase.js';

const require = createRequire(path.join(process.cwd(), 'package.json'));
const cli = require.resolve('sequelize-cli/lib/sequelize');

function runCli(args) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'test' },
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const output = `${result.stdout}\n${result.stderr}`.trim().split('\n').slice(-15).join('\n');
    throw new Error(`sequelize-cli ${args[0]} failed on the test database:\n${output}`);
  }
}

export default function globalSetup() {
  dotenv.config({ quiet: true });
  process.env.NODE_ENV = 'test';
  assertTestDatabase(process.env.DB_NAME_TEST || 'central_auth_test');

  runCli(['db:create', '--charset', 'utf8mb4', '--collate', 'utf8mb4_0900_ai_ci']);
  runCli(['db:migrate']);
}
