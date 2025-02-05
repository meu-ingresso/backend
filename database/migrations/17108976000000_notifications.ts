import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'notifications';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('title').notNullable();
      table.text('content').notNullable();
      table.enum('type', ['admin_to_promoter', 'promoter_to_customer', 'admin_to_customer']).notNullable();
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('SET NULL');
      table.uuid('sender_id').notNullable().references('id').inTable('users').onDelete('SET NULL');
      table.uuid('receiver_id').notNullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('read_at').nullable();
      table.timestamp('created_at', { useTz: true }).notNullable();
      table.timestamp('updated_at', { useTz: true }).notNullable();
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
