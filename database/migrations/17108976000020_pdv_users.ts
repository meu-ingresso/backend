import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class PdvUsersSchema extends BaseSchema {
  protected tableName = 'pdv_users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('pdv_id').notNullable().references('id').inTable('pdvs').onDelete('CASCADE');
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
