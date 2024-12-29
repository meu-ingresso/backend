import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventAttachmentsSchema extends BaseSchema {
  protected tableName = 'event_attachments';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.string('type', 50).nullable();
      table.string('image_url', 255).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
