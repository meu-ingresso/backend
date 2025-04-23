import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class AddMercadoPagoFieldsToPayments extends BaseSchema {
  protected tableName = 'payments';

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Campo para armazenar o ID do pagamento no Mercado Pago
      table.string('external_id', 100).nullable();

      // Campo para armazenar o status original do Mercado Pago
      table.string('external_status', 50).nullable();

      // Campo para armazenar o método de pagamento específico (credit_card, debit_card, pix, boleto, etc)
      table.string('payment_method_details', 50).nullable();

      // Campo para armazenar o número de parcelas (para cartão de crédito)
      table.integer('installments').nullable();

      // Campos para QR Code do PIX
      table.text('pix_qr_code').nullable();
      table.text('pix_qr_code_base64').nullable();

      // Campo para armazenar os últimos 4 dígitos do cartão
      table.string('last_four_digits', 4).nullable();

      // Campo para armazenar o payload de resposta
      table.jsonb('response_data').nullable();
    });
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('external_id');
      table.dropColumn('external_status');
      table.dropColumn('payment_method_details');
      table.dropColumn('installments');
      table.dropColumn('pix_qr_code');
      table.dropColumn('pix_qr_code_base64');
      table.dropColumn('last_four_digits');
      table.dropColumn('response_data');
    });
  }
}
