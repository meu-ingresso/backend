import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payment_tickets'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('ticket_original_name', 255).nullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('ticket_original_name')
    })
  }
}
