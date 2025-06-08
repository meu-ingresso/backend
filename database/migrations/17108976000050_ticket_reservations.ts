import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketReservationsSchema extends BaseSchema {
  protected tableName = 'ticket_reservations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);
      table.dateTime('expires_time').notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
