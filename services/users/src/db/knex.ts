import path from 'path';
import knex from 'knex';

const env = process.env.NODE_ENV || 'development';

const knexConfig = require(path.resolve(process.cwd(), 'knexfile.js'));

export const pg = knex(knexConfig[env]);
