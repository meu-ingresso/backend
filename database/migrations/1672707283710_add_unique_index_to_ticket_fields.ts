import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToTicketFieldsSchema extends BaseSchema {
  protected tableName = 'tickets_fields';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS tickets_fields_unique 
      ON ${this.tableName} (customer_ticket_id, field_id) 
      WHERE deleted_at IS NULL
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS tickets_fields_unique
    `);
  }
}
