import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddressesSchema extends BaseSchema {
  protected tableName = 'addresses';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('street', 255).notNullable();
      table.string('zipcode', 20).notNullable();
      table.string('number', 20).nullable();
      table.string('complement', 255).nullable();
      table.string('neighborhood', 255).notNullable();
      table.decimal('latitude', 10, 8).nullable();
      table.decimal('longitude', 11, 8).nullable();
      table.uuid('city_id').notNullable().references('id').inTable('cities').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}