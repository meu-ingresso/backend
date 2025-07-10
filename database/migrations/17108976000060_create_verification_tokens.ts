import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreateVerificationTokens extends BaseSchema {
  protected tableName = 'verification_tokens';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('token', 255).notNullable().unique();
      table.enum('type', ['email_verification', 'password_reset']).notNullable();
      table.boolean('used').defaultTo(false);

      table.timestamp('expires_at', { useTz: true }).notNullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
