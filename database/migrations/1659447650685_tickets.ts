import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketsSchema extends BaseSchema {
  protected tableName = 'tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table
        .uuid('ticket_event_category_id')
        .nullable()
        .references('id')
        .inTable('ticket_event_categories')
        .onDelete('RESTRICT');
      table.string('name', 50).notNullable();
      table.string('description', 100).nullable();
      table.integer('total_quantity', 255).notNullable();
      table.integer('total_sold', 255).notNullable().defaultTo(0);
      table.decimal('price', 10, 2).notNullable();
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('RESTRICT');
      table.dateTime('start_date').notNullable();
      table.dateTime('end_date').notNullable();
      table.enum('availability', ['Privado', 'Publico', 'PDV']).notNullable().defaultTo('Publico');
      table.integer('display_order').notNullable().defaultTo(1);
      table.integer('min_quantity_per_user').notNullable().defaultTo(1);
      table.integer('max_quantity_per_user').notNullable().defaultTo(5);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
