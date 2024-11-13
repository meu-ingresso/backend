import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('cellphone', 50).nullable();
      table.string('email', 254).notNullable().unique();
      table.string('password', 180).notNullable();
      table.boolean('is_active').notNullable();
      table.uuid('role_id').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
