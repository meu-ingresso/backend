import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class RatingsSchema extends BaseSchema {
  protected tableName = 'ratings';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 50).notNullable().unique();
      table.text('description').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
