import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PaymentsSchema extends BaseSchema {
  protected tableName = 'payments';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('SET NULL');
      table.string('payment_method', 50).notNullable();
      table.decimal('gross_value', 10, 2).notNullable();
      table.decimal('net_value', 10, 2).nullable();
      table.timestamp('paid_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}