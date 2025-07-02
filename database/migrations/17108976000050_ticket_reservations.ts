import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketReservationsSchema extends BaseSchema {
  protected tableName = 'ticket_reservations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);
      table.decimal('current_ticket_price', 12, 2).notNullable();
      table.boolean('event_absorb_service_fee').notNullable().defaultTo(false);
      table.decimal('event_platform_fee', 12, 2).notNullable().defaultTo(0);
      table.dateTime('expires_time').notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
