import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class TicketEventCategoriesSchema extends BaseSchema {
  protected tableName = 'ticket_event_categories';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name', 50).notNullable();
      table.boolean('is_active').notNullable().defaultTo(true);
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
