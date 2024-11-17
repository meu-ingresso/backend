import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ParametersSchema extends BaseSchema {
  protected tableName = 'parameters';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('key', 100).notNullable().unique();
      table.text('value').nullable();
      table.string('description', 255).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
