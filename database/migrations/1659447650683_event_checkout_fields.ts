import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventCheckoutFieldsSchema extends BaseSchema {
  protected tableName = 'event_checkout_fields';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('event_id').notNullable().references('id').inTable('events').onDelete('CASCADE');
      table.string('name', 50).notNullable();
      table
        .enum('type', [
          'CPF',
          'CNPJ',
          'TELEFONE',
          'DATA',
          'TEXTO',
          'MENU_DROPDOWN',
          'MULTI_CHECKBOX',
          'TERMO',
          'MESA',
          'ASSENTO',
        ])
        .notNullable()
        .defaultTo('TEXTO');
      table.enum('person_type', ['PF', 'PJ', 'ESTRANGEIRO']).notNullable().defaultTo('PF');
      table.boolean('required').notNullable().defaultTo(false);
      table.boolean('is_unique').notNullable().defaultTo(false);
      table.boolean('visible_on_ticket').notNullable().defaultTo(false);
      table.string('help_text', 255).nullable();
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
