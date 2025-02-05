import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToStatusesSchema extends BaseSchema {
  protected tableName = 'statuses';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS statuses_unique 
      ON ${this.tableName} (name, module) 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS statuses_unique
    `);
  }
}
