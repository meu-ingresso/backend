import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('people_id').notNullable().references('id').inTable('people').onDelete('CASCADE');
      table.string('email', 200).unique().nullable();
      table.string('alias', 30).unique().notNullable();
      table.string('password', 100).nullable();
      table.uuid('role_id').nullable().references('id').inTable('roles').onDelete('SET NULL');
      table.boolean('account_verified').notNullable().defaultTo(false);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
