import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class StatusesSchema extends BaseSchema {
  protected tableName = 'statuses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable();
      table.string('module', 100).notNullable();
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
