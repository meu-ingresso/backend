import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketsFieldsSchema extends BaseSchema {
  protected tableName = 'tickets_fields';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('customer_ticket_id').notNullable().references('id').inTable('customer_tickets').onDelete('CASCADE');
      table.uuid('field_id').notNullable().references('id').inTable('event_checkout_fields').onDelete('CASCADE');
      table.integer('order').notNullable().defaultTo(1);
      table.text('value').notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());

      table.unique(['customer_ticket_id', 'field_id', 'order']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
