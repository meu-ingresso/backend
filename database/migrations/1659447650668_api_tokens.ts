import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class ApiTokensSchema extends BaseSchema {
  protected tableName = 'api_tokens';

  public async up() {
    await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('uuid_generate_v4()'));
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.string('type', 255).notNullable();
      table.string('token', 64).notNullable().unique();
      table.timestamp('expires_at', { useTz: true }).nullable();
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
