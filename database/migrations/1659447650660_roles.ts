import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class RolesSchema extends BaseSchema {
  protected tableName = 'roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 50).notNullable().unique();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}