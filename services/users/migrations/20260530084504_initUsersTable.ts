import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', function (table) {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.string('password_hash');
    table.string('name').defaultTo('USER-');
    table.timestamp('created_at', {useTz: false}).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
