import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CustomerTicketsSchema extends BaseSchema {
  protected tableName = 'customer_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('payment_ticket_id').notNullable().references('id').inTable('payment_tickets').onDelete('CASCADE');
      table.uuid('current_owner_id').nullable().references('id').inTable('people').onDelete('CASCADE');
      table.uuid('previous_owner_id').nullable().references('id').inTable('people').onDelete('CASCADE');
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('CASCADE');
      table.string('ticket_identifier', 255).nullable().unique();
      table.boolean('validated').notNullable().defaultTo(false);
      table.uuid('validated_by').nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('validated_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
