import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CustomerTicketsSchema extends BaseSchema {
  protected tableName = 'customer_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.string('owner_name', 255).notNullable();
      table.string('owner_email', 255).notNullable();
      table.string('owner_tax', 20).nullable();
      table.string('status', 50).defaultTo('NOT_USED');
      table.string('ticket_identifier', 255).nullable().unique();
      table.boolean('validated').defaultTo(false);
      table.timestamp('validated_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
