// CommonJS because sequelize-cli loads it with require(). Shared by the app and the CLI.
require('dotenv').config({ quiet: true });

const testDatabase = process.env.DB_NAME_TEST || 'central_auth_test';

if (process.env.NODE_ENV === 'test' && !testDatabase.endsWith('_test')) {
  throw new Error('Refusing to run: the test database name must end with _test');
}

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD || null,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  dialect: 'mysql',
  timezone: '+00:00',
  logging: false,
  define: {
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_0900_ai_ci',
  },
  migrationStorageTableName: 'sequelize_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_data',
};

module.exports = {
  development: { ...base, database: process.env.DB_NAME },
  test: { ...base, database: testDatabase },
  production: { ...base, database: process.env.DB_NAME },
};
