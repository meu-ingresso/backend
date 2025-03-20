import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CitiesSchema extends BaseSchema {
  protected tableName = 'cities';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('state_id').notNullable().references('id').inTable('states').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
