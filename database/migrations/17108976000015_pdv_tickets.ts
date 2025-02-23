import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PdvTicketsSchema extends BaseSchema {
  protected tableName = 'pdv_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('pdv_id').notNullable().references('id').inTable('pdvs').onDelete('CASCADE');
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
