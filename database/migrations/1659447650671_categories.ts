import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CategoriesSchema extends BaseSchema {
  protected tableName = 'categories';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable().unique();
      table.text('description').nullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
