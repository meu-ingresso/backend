import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventViewsSchema extends BaseSchema {
  protected tableName = 'event_views';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.uuid('user_id').nullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('session', 255).notNullable();
      table.string('ip_address', 255).notNullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
