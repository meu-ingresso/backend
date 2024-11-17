import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventsSchema extends BaseSchema {
  protected tableName = 'events';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('name', 100).notNullable();
      table.text('description').nullable();
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('RESTRICT');
      table.uuid('address_id').nullable().references('id').inTable('addresses').onDelete('SET NULL');
      table.uuid('category_id').nullable().references('id').inTable('categories').onDelete('SET NULL');
      table.uuid('rating_id').nullable().references('id').inTable('ratings').onDelete('SET NULL');
      table.dateTime('start_date').notNullable();
      table.dateTime('end_date').nullable();
      table.string('opening_hour', 20).nullable();
      table.string('contact', 100).nullable();
      table.string('location_name', 150).nullable();
      table.text('general_information').nullable();
      table.string('house_map', 255).nullable();
      table.integer('max_capacity').nullable();
      table.uuid('promoter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
