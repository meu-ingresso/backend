import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class CreatePaymentTicketsTable extends BaseSchema {
  protected tableName = 'payment_tickets';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary();
      table.uuid('payment_id').notNullable().references('id').inTable('payments').onDelete('CASCADE');
      table.uuid('ticket_id').notNullable().references('id').inTable('tickets').onDelete('CASCADE');
      table.integer('quantity').notNullable().defaultTo(1);

      table.string('ticket_original_name', 255).nullable()
      
      // Valores originais do ingresso no momento da compra
      table.decimal('ticket_original_price', 12, 2).notNullable();
      
      // Cálculos de desconto do cupom (aplicado antes da taxa)
      table.decimal('coupon_discount_value', 12, 2).nullable().defaultTo(0);
      table.decimal('ticket_price_after_coupon', 12, 2).notNullable();
      
      // Cálculos de taxa de serviço
      table.decimal('service_fee_percentage', 5, 2).nullable();
      table.decimal('service_fee_fixed', 12, 2).nullable();
      table.decimal('service_fee_applied', 12, 2).nullable().defaultTo(0);
      
      // Valor final por ingresso
      table.decimal('ticket_final_price', 12, 2).notNullable();
      
      // Totais para esta linha (quantidade * valores)
      table.decimal('total_original_value', 12, 2).notNullable();
      table.decimal('total_coupon_discount', 12, 2).nullable().defaultTo(0);
      table.decimal('total_service_fee', 12, 2).nullable().defaultTo(0);
      table.decimal('total_final_value', 12, 2).notNullable();

      // Evento absorve a taxa de serviço e valor dessa taxa
      table.boolean('event_absorb_service_fee').notNullable().defaultTo(false);
      table.decimal('event_platform_fee', 12, 2).notNullable().defaultTo(0);

      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
} 