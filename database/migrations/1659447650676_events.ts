import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class EventsSchema extends BaseSchema {
  protected tableName = 'events';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.string('alias', 255).notNullable();
      table.string('name', 100).notNullable();
      table.text('description').nullable();
      table.uuid('status_id').notNullable().references('id').inTable('statuses').onDelete('RESTRICT');
      table.uuid('address_id').nullable().references('id').inTable('addresses').onDelete('SET NULL');
      table.uuid('category_id').nullable().references('id').inTable('categories').onDelete('SET NULL');
      table.uuid('rating_id').nullable().references('id').inTable('ratings').onDelete('SET NULL');
      table.dateTime('start_date').notNullable();
      table.dateTime('end_date').nullable();
      table.string('location_name', 150).nullable();
      table.text('general_information').nullable();
      table.enum('availability', ['Publico', 'Privado', 'Página']).notNullable().defaultTo('Publico');
      table.enum('sale_type', ['Ingresso', 'Inscrição']).notNullable().defaultTo('Ingresso');
      table.enum('event_type', ['Presencial', 'Online', 'Híbrido']).notNullable().defaultTo('Presencial');
      table.uuid('promoter_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.text('id_pixel').nullable();
      table.text('id_tag_manager').nullable();
      table.text('id_analytics').nullable();
      table.text('id_google_ads').nullable();
      table.text('ads_conversion_label').nullable();
      table.boolean('is_featured').notNullable().defaultTo(false);
      table.boolean('absorb_service_fee').notNullable().defaultTo(true).after('ads_conversion_label');
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('deleted_at', { useTz: true }).nullable();

      // Índices para consultas frequentes
      table.index(['alias'], 'events_alias_index');
      table.index(['promoter_id'], 'events_promoter_id_index');
      table.index(['status_id'], 'events_status_id_index');
      table.index(['category_id'], 'events_category_id_index');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
