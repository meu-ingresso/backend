import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToPdvTicketssSchema extends BaseSchema {
  protected tableName = 'pdv_tickets';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS pdv_tickets_unique 
      ON ${this.tableName} (pdv_id, ticket_id) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS pdv_tickets_unique
    `);
  }
}
