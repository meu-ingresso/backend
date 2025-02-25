import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToTicketEventCategoriesSchema extends BaseSchema {
  protected tableName = 'ticket_event_categories';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS ticket_event_categories_unique 
      ON ${this.tableName} (event_id, name) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS ticket_event_categories_unique
    `);
  }
}
