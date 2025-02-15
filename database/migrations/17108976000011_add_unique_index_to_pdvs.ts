import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToPdvsSchema extends BaseSchema {
  protected tableName = 'pdvs';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS pdvs_unique 
      ON ${this.tableName} (event_id, name) 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS tickets_unique
    `);
  }
}
