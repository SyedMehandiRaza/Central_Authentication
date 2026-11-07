import { createApp } from './app.js';
import { env } from './config/env.js';
import { sequelize } from './models/index.js';
import { logger } from './utils/logger.js';
import { checkDatabaseVersion } from './utils/mysqlVersion.js';

async function start() {
  await sequelize.authenticate();
  await checkDatabaseVersion(sequelize);

  const server = createApp().listen(env.PORT, () => {
    logger.info(`API listening on port ${env.PORT}`);
  });

  let isShuttingDown = false;

  const shutdown = (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;
    logger.info(`${signal} received, shutting down`);

    server.close(async () => {
      await sequelize.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((err) => {
  logger.fatal({ errorName: err.name }, `Startup failed: ${err.message}`);
  process.exit(1);
});
