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

    sqlserver: {
      client: 'mssql',
      connection: {
        server: Env.get('MSSQL_HOST'),
        port: parseInt(Env.get('MSSQL_PORT', '9322')),
        user: Env.get('MSSQL_USER'),
        password: Env.get('MSSQL_PASSWORD'),
        database: Env.get('MSSQL_DB_NAME'),
        options: {
          encrypt: true,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      },
    },
  },
};

export default databaseConfig;
