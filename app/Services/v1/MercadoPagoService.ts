import { MercadoPagoConfig, Payment, PaymentRefund } from 'mercadopago';
import Env from '@ioc:Adonis/Core/Env';
import Logger from '@ioc:Adonis/Core/Logger';

export default class MercadoPagoService {
  private client;
  private payment;
  private paymentRefund;

  constructor() {
    this.client = new MercadoPagoConfig({
      accessToken: Env.get('MERCADOPAGO_ACCESS_TOKEN'),
      options: { timeout: 5000 },
    });
    this.payment = new Payment(this.client);
    this.paymentRefund = new PaymentRefund(this.client);
  }

  /**
   * Processa um pagamento com cartão de crédito
   */
  public async processCardPayment(paymentData) {
    try {
      const { body, requestOptions = {} } = this.buildCardPaymentRequest(paymentData);

      const result = await this.payment.create({ body, requestOptions });

      return {
        success: true,
        data: result,
        external_id: result.id,
        status: result.status,
      };
    } catch (error) {
      Logger.error('Erro ao processar pagamento com cartão: %o', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Processa um pagamento com Pix
   */
  public async processPixPayment(paymentData) {
    try {
      const { body, requestOptions = {} } = this.buildPixPaymentRequest(paymentData);

      const result = await this.payment.create({ body, requestOptions });

      return {
        success: true,
        data: result,
        external_id: result.id,
        status: result.status,
        qr_code: result.point_of_interaction?.transaction_data?.qr_code,
        qr_code_base64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      };
    } catch (error) {
      Logger.error('Erro ao processar pagamento com Pix: %o', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Consulta o status de um pagamento
   */
  public async getPaymentStatus(paymentId) {
    try {
      const result = await this.payment.get({ id: paymentId });

      return {
        success: true,
        data: result,
        status: result.status,
      };
    } catch (error) {
      Logger.error('Erro ao consultar status do pagamento: %o', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Processa o reembolso total de um pagamento
   */
  public async refundPayment(paymentId: string) {
    try {
      const paymentInfo = await this.payment.get({ id: paymentId });

      if (paymentInfo.status !== 'approved') {
        return {
          success: false,
          error: 'Pagamento não está aprovado para reembolso',
        };
      }

      const refundResult = await this.paymentRefund.create({
        payment_id: paymentId,
        body: {},
      });

      return {
        success: true,
        data: refundResult,
        external_id: refundResult.id,
        status: refundResult.status,
      };
    } catch (error) {
      Logger.error('Erro ao processar reembolso do pagamento: %o', error);

      return {
        success: false,
        error: error.message || 'Erro ao processar reembolso',
      };
    }
  }

  /**
   * Constrói o payload para pagamento com cartão
   */
  private buildCardPaymentRequest(paymentData) {
    const {
      transaction_amount,
      description,
      payer,
      token,
      installments = 1,
      payment_method_id,
      external_reference,
      notification_url,
    } = paymentData;

    // Gera external_reference se não fornecido
    const finalExternalReference = external_reference || `payment-${new Date().getTime()}`;

    const body = {
      transaction_amount,
      description,
      payment_method_id,
      token,
      installments,
      payer,
      external_reference: finalExternalReference,
      notification_url: notification_url || Env.get('MERCADOPAGO_WEBHOOK_URL'),
      additional_info: {
        items: paymentData.items || [],
      },
    };

    return {
      body,
      requestOptions: {
        idempotencyKey: `payment-${finalExternalReference}-${new Date().getTime()}`,
      },
    };
  }

  /**
   * Constrói o payload para pagamento Pix
   */
  private buildPixPaymentRequest(paymentData) {
    const { transaction_amount, description, payer, external_reference, notification_url } = paymentData;

    // Gera external_reference se não fornecido
    const finalExternalReference = external_reference || `auto-pix-${new Date().getTime()}`;

    const body = {
      transaction_amount,
      description,
      payment_method_id: 'pix',
      payer,
      external_reference: finalExternalReference,
      notification_url: notification_url || Env.get('MERCADOPAGO_WEBHOOK_URL'),
      additional_info: {
        items: paymentData.items || [],
      },
    };

    return {
      body,
      requestOptions: {
        idempotencyKey: `payment-${finalExternalReference}-${new Date().getTime()}`,
      },
    };
  }
}
