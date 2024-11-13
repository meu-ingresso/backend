import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AuditiesSchema extends BaseSchema {
  protected tableName = 'audities';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').references('id').inTable('users').onUpdate('CASCADE').onDelete('CASCADE').notNullable();
      table.string('module', 50).notNullable();
      table.text('action').notNullable();
      table.text('content').notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
