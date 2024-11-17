import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AuditLogsSchema extends BaseSchema {
  protected tableName = 'audit_logs';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('action', 100).notNullable();
      table.string('entity', 100).notNullable();
      table.uuid('entity_id').nullable();
      table.uuid('user_id').nullable().references('id').inTable('users').onDelete('SET NULL');
      table.json('old_data').nullable();
      table.json('new_data').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
