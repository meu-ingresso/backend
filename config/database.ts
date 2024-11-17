import Env from '@ioc:Adonis/Core/Env';
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database';

const databaseConfig: DatabaseConfig = {
  connection: Env.get('DB_CONNECTION'),

  connections: {
    pg: {
      client: 'pg',
      connection: {
        host: Env.get('PG_HOST'),
        port: Env.get('PG_PORT'),
        user: Env.get('PG_USER'),
        password: Env.get('PG_PASSWORD', ''),
        database: Env.get('PG_DB_NAME'),
        ssl: {
          rejectUnauthorized: false,
        },
      },
      migrations: {
        naturalSort: true,
        tableName: 'schema',
      },
      pool: {
        min: 10,
        max: 500,
      },
      healthCheck: false,
      debug: false,
    },
  },
};

export default databaseConfig;
