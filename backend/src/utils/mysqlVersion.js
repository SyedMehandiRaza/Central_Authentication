const MINIMUM = [8, 0, 16];

export function assertSupportedMysqlVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)/.exec(version);
  const isMariaDb = /mariadb/i.test(version);

  const isSupported =
    match &&
    !isMariaDb &&
    match
      .slice(1)
      .map(Number)
      .reduce((order, part, index) => order || Math.sign(part - MINIMUM[index]), 0) >= 0;

  if (!isSupported) {
    throw new Error(
      `MySQL 8.0.16 or newer is required (MariaDB is not supported); found ${version}`,
    );
  }
}

export async function checkDatabaseVersion(sequelize) {
  assertSupportedMysqlVersion(await sequelize.databaseVersion());
}
