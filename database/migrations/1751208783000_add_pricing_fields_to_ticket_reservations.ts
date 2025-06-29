import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddPricingFieldsToTicketReservations extends BaseSchema {
  protected tableName = 'ticket_reservations';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.decimal('current_ticket_price', 12, 2).notNullable();
      table.boolean('event_absorb_service_fee').notNullable().defaultTo(false);
      table.decimal('event_platform_fee', 12, 2).notNullable().defaultTo(0);
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('current_ticket_price');
      table.dropColumn('event_absorb_service_fee');
      table.dropColumn('event_platform_fee');
    });
  }
}
