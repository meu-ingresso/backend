import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CouponsTicketsSchema extends BaseSchema {
  protected tableName = 'coupons_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('coupon_id').notNullable().references('id').inTable('coupons').onDelete('CASCADE');
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
