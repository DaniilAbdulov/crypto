require('dotenv').config();

/** @type {import('knex').Knex.Config} */
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

const config = {
  development: base,
  production: base,
  test: {
    ...base,
    connection: {
      database: 'usersForTests',
      user: 'postgres',
      password: '0896',
    },
  },
};

module.exports = config;
