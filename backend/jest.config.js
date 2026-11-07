const transform = {
  '^.+\\.js$': [
    'babel-jest',
    {
      babelrc: false,
      configFile: false,
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
    },
  ],
};

// The db and migrations projects load backend/.env (DB credentials) before setupEnv fills the
// test defaults, and their globalSetup creates and migrates the `_test` database first.
const dbSetupFiles = ['<rootDir>/src/test/setupDbEnv.js', '<rootDir>/src/test/setupEnv.js'];
const globalSetup = '<rootDir>/src/test/globalSetup.js';

// `unit` never touches a database. `db` uses the shared `_test` database, so run it in band.
// `migrations` is opt-in (npm run test:migrations -w backend): it runs every migration down and up.
export default {
  projects: [
    {
      displayName: 'unit',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.test.js'],
      testPathIgnorePatterns: ['/node_modules/', '\\.db\\.test\\.js$', '\\.roundtrip\\.test\\.js$'],
      setupFiles: ['<rootDir>/src/test/setupEnv.js'],
      transform,
    },
    {
      displayName: 'db',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.db.test.js'],
      globalSetup,
      setupFiles: dbSetupFiles,
      transform,
    },
    {
      displayName: 'migrations',
      testEnvironment: 'node',
      testMatch: ['**/__tests__/**/*.roundtrip.test.js'],
      globalSetup,
      setupFiles: dbSetupFiles,
      transform,
    },
  ],
};
