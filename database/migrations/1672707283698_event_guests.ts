import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventGuestsSchema extends BaseSchema {
  protected tableName = 'event_guests';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('first_name', 255).notNullable();
      table.string('last_name', 255).nullable();
      table.integer('quantity', 11).notNullable();
      table.uuid('guest_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.boolean('validated').notNullable().defaultTo(false);
      table.uuid('validated_by').nullable().references('id').inTable('users').onDelete('SET NULL');
      table.timestamp('validated_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
