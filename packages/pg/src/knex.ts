import knex, {Knex} from 'knex';

export function createDb(config: Knex.Config) {
  return knex(config);
}
