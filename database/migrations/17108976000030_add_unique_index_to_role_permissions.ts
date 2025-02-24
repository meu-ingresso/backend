import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToRolePermissionsSchema extends BaseSchema {
  protected tableName = 'role_permissions';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_unique 
      ON ${this.tableName} (role_id, permission_id) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS role_permissions_unique
    `);
  }
}
