import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToCouponsSchema extends BaseSchema {
  protected tableName = 'coupons';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS coupons_unique 
      ON ${this.tableName} (event_id, code) 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS coupons_unique
    `);
  }
}
