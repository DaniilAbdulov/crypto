import knex, {Knex} from 'knex';

export function createDb(config: Knex.Config) {
  console.log('createDb loaded');
  return knex(config);
}
