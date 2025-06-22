import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PaymentsSchema extends BaseSchema {
  protected tableName = 'payments';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('people_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('SET NULL');
      table.string('payment_method', 50).notNullable();
      table.decimal('gross_value', 10, 2).notNullable();
      table.decimal('net_value', 10, 2).notNullable();
      table.uuid('coupon_id').nullable().references('id').inTable('coupons').onDelete('SET NULL');
      table.uuid('pdv_id').nullable().references('id').inTable('pdvs').onDelete('SET NULL');
      table.timestamp('paid_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
