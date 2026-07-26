import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { DataSource } from 'typeorm';
import { env } from '../env';
import { setDataSource } from '../api/utils/dataSource';

export const typeormLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
  const baseConfig: any = {
    type: env.db.type,
    database: env.db.database,
    synchronize: env.db.synchronize,
    logging: env.db.logging,
    entities: env.app.dirs.entities,
  };

  if (env.db.type === 'mysql') {
    baseConfig.host = env.db.host;
    baseConfig.port = env.db.port;
    baseConfig.username = env.db.username;
    baseConfig.password = env.db.password;
  }

  const dataSource = new DataSource(baseConfig);

  await dataSource.initialize();
  setDataSource(dataSource);

  if (settings) {
    settings.setData('connection', dataSource);
    settings.onShutdown(() => dataSource.destroy());
  }
};
