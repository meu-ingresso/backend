import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class NpsSchema extends BaseSchema {
  protected tableName = 'permissions';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('module_prefix', 50).nullable();
      table.string('module_name', 50).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
