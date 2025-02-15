import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PdvSchema extends BaseSchema {
  protected tableName = 'pdvs';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
