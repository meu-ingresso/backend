import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PeopleSchema extends BaseSchema {
  protected tableName = 'people';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('first_name', 100).notNullable();
      table.string('last_name', 100).notNullable();
      table.string('person_type', 50).notNullable();
      table.string('tax', 20).nullable();
      table.date('birth_date').nullable();
      table.string('phone', 50).nullable();
      table.string('email', 254).notNullable().unique();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
