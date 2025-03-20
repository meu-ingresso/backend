import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class StatesSchema extends BaseSchema {
  protected tableName = 'states';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 255).notNullable();
      table.string('acronym', 5).notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
