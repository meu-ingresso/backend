import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CouponsSchema extends BaseSchema {
  protected tableName = 'coupons';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('code', 50).notNullable();
      table.string('discount_type', 50).notNullable();
      table.decimal('discount_value', 10, 2).notNullable();
      table.integer('max_uses').notNullable();
      table.integer('uses').defaultTo(0);
      table.dateTime('start_date').notNullable();
      table.dateTime('end_date').notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());

      table.unique(['event_id', 'code']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
