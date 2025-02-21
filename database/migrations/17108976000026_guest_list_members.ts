import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class GuestListMembersSchema extends BaseSchema {
  protected tableName = 'guest_list_members';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('guest_list_id').notNullable().references('id').inTable('guest_lists').onDelete('CASCADE');
      table.string('first_name', 255).notNullable();
      table.string('last_name', 255).nullable();
      table.integer('quantity', 11).notNullable();
      table.uuid('added_by').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
