import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CardPaymentValidator, PixPaymentValidator } from 'App/Validators/v1/PaymentsValidator';
import MercadoPagoService from 'App/Services/v1/MercadoPagoService';
import utils from 'Utils/utils';
import Payments from 'App/Models/Access/Payments';
import StatusService from 'App/Services/v1/StatusService';
import DynamicService from 'App/Services/v1/DynamicService';
import { DateTime } from 'luxon';

export default class MercadoPagoController {
  private mercadoPagoService: MercadoPagoService = new MercadoPagoService();
  private statusesService: StatusService = new StatusService();
  private dynamicService: DynamicService = new DynamicService();

  /**
   * Processar pagamento com cartão de crédito
   */
  public async processCardPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(CardPaymentValidator);

      // Obtém o status pendente
      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      // Cria um registro de pagamento pendente
      const payment = await Payments.create({
        user_id: paymentData.user_id,
        coupon_id: paymentData.coupon_id,
        pdv_id: paymentData.pdv_id,
        // @ts-ignore
        status_id: pendingStatus.id,
        payment_method: 'credit_card',
        payment_method_details: paymentData.payment_method_id,
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
        installments: paymentData.installments || 1,
      });

      // Processa o pagamento no Mercado Pago
      const result = await this.mercadoPagoService.processCardPayment(paymentData);

      if (!result.success) {
        // Em caso de erro, atualiza o status para erro
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        await payment
          .merge({
            // @ts-ignore
            status_id: errorStatus.id,
            response_data: JSON.stringify(result),
          })
          .save();

        return utils.handleError(context, 400, 'CARD_PAYMENT_ERROR', `${result?.error}`);
      }

      // Determina o status com base no retorno do Mercado Pago
      let newStatus = pendingStatus;
      if (result.status === 'approved') {
        newStatus = await this.statusesService.searchStatusByName('Aprovado', 'payment');
      } else if (result.status === 'rejected') {
        newStatus = await this.statusesService.searchStatusByName('Rejeitado', 'payment');
      }

      // Atualiza o registro de pagamento
      await payment
        .merge({
          external_id: result.external_id,
          external_status: result.status,
          // @ts-ignore
          status_id: newStatus.id,
          response_data: result.data,
          paid_at: result.status === 'approved' ? DateTime.local() : null,
          last_four_digits: result.data?.card?.last_four_digits || null,
        })
        .save();

      return utils.handleSuccess(
        context,
        {
          payment_id: payment.id,
          status: result.status,
          external_id: result.external_id,
        },
        'CARD_PAYMENT_SUCCESS',
        200
      );
    } catch (error) {
      return utils.handleError(context, 400, 'CARD_PAYMENT_ERROR', `${error}`);
    }
  }

  /**
   * Processar pagamento com PIX
   */
  public async processPixPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(PixPaymentValidator);

      // Obtém o status pendente
      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      // Cria um registro de pagamento pendente
      const payment = await Payments.create({
        user_id: paymentData.user_id,
        // @ts-ignore
        status_id: pendingStatus.id,
        payment_method: 'pix',
        payment_method_details: 'pix',
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
      });

      // Processa o pagamento no Mercado Pago
      const result = await this.mercadoPagoService.processPixPayment(paymentData);

      if (!result.success) {
        // Em caso de erro, atualiza o status para erro
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        await payment
          .merge({
            // @ts-ignore
            status_id: errorStatus.id,
            response_data: result.error,
          })
          .save();

        return utils.handleError(context, 400, 'PIX_PAYMENT_ERROR', `${result[0].error}`);
      }

      // Atualiza o registro de pagamento
      await payment
        .merge({
          external_id: result.external_id,
          external_status: result.status,
          pix_qr_code: result.qr_code,
          pix_qr_code_base64: result.qr_code_base64,
          response_data: result.data,
        })
        .save();

      return utils.handleSuccess(
        context,
        {
          payment_id: payment.id,
          status: result.status,
          external_id: result.external_id,
          qr_code: result.qr_code,
          qr_code_base64: result.qr_code_base64,
        },
        'PIX_PAYMENT_SUCCESS',
        200
      );
    } catch (error) {
      return utils.handleError(context, 400, 'PIX_PAYMENT_ERROR', `${error}`);
    }
  }

  /**
   * Webhook para receber notificações do Mercado Pago
   */
  public async handleWebhook(context: HttpContextContract) {
    try {
      const payload = context.request.body();

      // Verifica se é uma notificação de pagamento
      if (payload.type !== 'payment') {
        return utils.handleSuccess(context, { received: true }, 'WEBHOOK_RECEIVED', 200);
      }

      // Consulta o status do pagamento no Mercado Pago
      const result = await this.mercadoPagoService.getPaymentStatus(payload.data.id);

      if (!result.success) {
        return utils.handleError(context, 400, 'PAYMENT_CHECK_ERROR', `${result.error}`);
      }

      // Busca o pagamento pelo external_id
      const payment = await Payments.query().where('external_id', payload.data.id).first();

      if (!payment) {
        return utils.handleError(context, 404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
      }

      // Determina o status com base no retorno do Mercado Pago
      let statusName = 'Pendente';
      if (result.status === 'approved') {
        statusName = 'Aprovado';
      } else if (result.status === 'rejected') {
        statusName = 'Rejeitado';
      } else if (result.status === 'refunded') {
        statusName = 'Reembolsado';
      }

      const newStatus = await this.statusesService.searchStatusByName(statusName, 'payment');

      // Atualiza o registro de pagamento
      await payment
        .merge({
          external_status: result.status,
          // @ts-ignore
          status_id: newStatus.id,
          paid_at: result.status === 'approved' ? DateTime.local() : payment.paid_at,
          response_data: result.data,
        })
        .save();

      return utils.handleSuccess(context, { updated: true }, 'WEBHOOK_PROCESSED', 200);
    } catch (error) {
      return utils.handleError(context, 400, 'WEBHOOK_ERROR', `${error}`);
    }
  }

  /**
   * Consulta um pagamento
   */
  public async getPayment(context: HttpContextContract) {
    try {
      const payment = await this.dynamicService.getById('Payment', context.params.id);

      if (!payment) {
        return utils.handleError(context, 404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
      }

      // Se tiver ID externo e status ainda for pendente, consulta o status atualizado
      if (payment.external_id && payment.status.name === 'Pendente') {
        const result = await this.mercadoPagoService.getPaymentStatus(payment.external_id);

        if (result.success && result.status !== payment.external_status) {
          // Determina o novo status
          let statusName = 'Pendente';
          if (result.status === 'approved') {
            statusName = 'Aprovado';
          } else if (result.status === 'rejected') {
            statusName = 'Rejeitado';
          } else if (result.status === 'refunded') {
            statusName = 'Reembolsado';
          }

          const newStatus = await this.statusesService.searchStatusByName(statusName, 'payment');

          // Atualiza o registro de pagamento
          await payment
            .merge({
              external_status: result.status,
              // @ts-ignore
              status_id: newStatus.id,
              paid_at: result.status === 'approved' ? DateTime.local() : payment.paid_at,
              response_data: result.data,
            })
            .save();

          // Recarrega o pagamento
          await payment.refresh();
          await payment.load('status');
        }
      }

      return utils.handleSuccess(context, payment, 'PAYMENT_FOUND', 200);
    } catch (error) {
      return utils.handleError(context, 400, 'PAYMENT_ERROR', `${error}`);
    }
  }
}
