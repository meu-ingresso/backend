import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToEventCheckoutFieldsTicketsSchema extends BaseSchema {
  protected tableName = 'event_checkout_fields_tickets';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS event_checkout_fields_tickets_unique 
      ON ${this.tableName} (event_checkout_field_id, ticket_id) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS event_checkout_fields_tickets_unique
    `);
  }
}
