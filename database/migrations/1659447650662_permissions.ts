import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PermissionsSchema extends BaseSchema {
  protected tableName = 'permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable().unique();
      table.text('description').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
