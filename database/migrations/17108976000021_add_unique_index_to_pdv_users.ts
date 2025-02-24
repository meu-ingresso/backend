import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToPdvUsersSchema extends BaseSchema {
  protected tableName = 'pdv_users';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS pdv_users_unique 
      ON ${this.tableName} (pdv_id, user_id) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS pdv_users_unique
    `);
  }
}
