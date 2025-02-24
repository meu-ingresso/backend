import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventGroupRelationsSchema extends BaseSchema {
  protected tableName = 'event_group_relations';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.uuid('group_id').notNullable().references('id').inTable('event_groups').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());

      table.unique(['event_id', 'group_id']);
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
