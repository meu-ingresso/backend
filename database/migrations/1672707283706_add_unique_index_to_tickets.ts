import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToTicketsSchema extends BaseSchema {
  protected tableName = 'tickets';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS tickets_unique 
      ON ${this.tableName} (event_id, display_order) 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS tickets_unique
    `);
  }
}
