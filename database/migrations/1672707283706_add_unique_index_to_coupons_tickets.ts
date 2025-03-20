import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddUniqueIndexToCouponsTicketsSchema extends BaseSchema {
  protected tableName = 'coupons_tickets';

  public async up() {
    await this.db.rawQuery(`
      CREATE UNIQUE INDEX IF NOT EXISTS coupons_tickets_unique 
      ON ${this.tableName} (coupon_id, ticket_id) 
    `);
  }

  public async down() {
    await this.db.rawQuery(`
      DROP INDEX IF EXISTS coupons_tickets_unique
    `);
  }
}
