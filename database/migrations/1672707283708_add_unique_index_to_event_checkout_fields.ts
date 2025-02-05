import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToEventCheckoutFieldsSchema extends BaseSchema {
  protected tableName = 'event_checkout_fields';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS event_checkout_fields_unique 
      ON ${this.tableName} (event_id, person_type, "display_order") 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS event_checkout_fields_unique
    `);
  }
}
