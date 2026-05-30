import type {Knex} from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const base = {
  client: 'postgresql',
  connection: {
    database: process.env.DB_DATABASE || 'invalid',
    user: process.env.DB_USER || 'invalid',
    password: process.env.DB_PASSWORD || 'invalid',
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};

const config: {[key: string]: Knex.Config} = {
  development: base,
  production: base,
  tests: {
    ...base,
    connection: {
      database: 'usersForTests',
      user: 'postgres',
      password: '0896',
    },
  },
};

const activeConfig =
  process.env.NODE_ENV === 'development'
    ? config.development
    : process.env.NODE_ENV === 'test'
      ? config.tests
      : config.production;

export default activeConfig;
