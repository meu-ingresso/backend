import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventCheckoutFieldsTicketsSchema extends BaseSchema {
  protected tableName = 'event_checkout_fields_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table
        .uuid('event_checkout_field_id')
        .notNullable()
        .references('id')
        .inTable('event_checkout_fields')
        .onDelete('CASCADE');
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();

      table.unique(['event_checkout_field_id', 'ticket_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
