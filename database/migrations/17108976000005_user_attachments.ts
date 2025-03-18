import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class UserAttachmentsSchema extends BaseSchema {
  protected tableName = 'user_attachments';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.string('type', 50).nullable();
      table.string('value', 255).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
