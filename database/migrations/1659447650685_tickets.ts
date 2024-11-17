import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketsSchema extends BaseSchema {
  protected tableName = 'tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name', 50).notNullable();
      table.integer('tier', 50).notNullable();
      table.integer('total_quantity', 255).notNullable();
      table.integer('remaining_quantity', 255).notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
