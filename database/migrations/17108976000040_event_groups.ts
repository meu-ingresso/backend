import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventGroupsSchema extends BaseSchema {
  protected tableName = 'event_groups';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable();
      table.text('description').nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
