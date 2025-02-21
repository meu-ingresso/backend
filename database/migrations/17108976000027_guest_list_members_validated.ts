import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class GuestListMembersValidatedSchema extends BaseSchema {
  protected tableName = 'guest_list_members_validated';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table
        .uuid('guest_list_member_id')
        .notNullable()
        .references('id')
        .inTable('guest_list_members')
        .onDelete('CASCADE');
      table.integer('quantity', 11).notNullable();
      table.uuid('validated_by').notNullable().references('id').inTable('users').onDelete('CASCADE');

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
