import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      // Adiciona o campo event_id como UUID com foreign key para a tabela events
      table.uuid('event_id').nullable().references('id').inTable('events').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('event_id')
    })
  }
}
