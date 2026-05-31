exports.up = async function (knex) {
  await knex.schema.createTable('users', function (table) {
    table.uuid('uuid').primary().defaultTo(knex.fn.uuid());
    table.string('password_hash');
    table.string('name').defaultTo('USER-');
    table.timestamp('created_at', {useTz: false}).defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable('users');
};
