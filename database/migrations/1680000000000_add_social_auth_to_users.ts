import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddSocialAuthToUsersSchema extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('google_id', 100).nullable().unique();
      table.string('provider', 50).notNullable().defaultTo('DEFAULT');
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('google_id');
      table.dropColumn('provider');
    });
  }
} 