import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventFeesSchema extends BaseSchema {
  protected tableName = 'event_fees';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.decimal('platform_fee', 10, 2).notNullable();
      table.decimal('promoter_fee', 10, 2).notNullable();
      table.decimal('fixed_fee', 10, 2).nullable();
      table.decimal('variable_fee', 5, 2).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}