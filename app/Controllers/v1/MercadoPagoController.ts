import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CardPaymentValidator, PixPaymentValidator } from 'App/Validators/v1/PaymentsValidator';
import MercadoPagoService from 'App/Services/v1/MercadoPagoService';
import utils from 'Utils/utils';
import Payments from 'App/Models/Access/Payments';
import CustomerTickets from 'App/Models/Access/CustomerTickets';
import TicketFields from 'App/Models/Access/TicketFields';
import StatusService from 'App/Services/v1/StatusService';
import PaymentCalculationService from 'App/Services/v1/PaymentCalculationService';
import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import PaymentTickets from 'App/Models/Access/PaymentTickets';

export default class MercadoPagoController {
  private mercadoPagoService: MercadoPagoService = new MercadoPagoService();
  private statusesService: StatusService = new StatusService();
  private paymentCalculationService: PaymentCalculationService = new PaymentCalculationService();

  public async processCardPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(CardPaymentValidator);

      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      if (!pendingStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Pendente" não encontrado');
      }

      const resultProcessPayment = await this.paymentCalculationService.processPayment({
        event_id: paymentData.event_id,
        people: paymentData.people,
        coupon_id: paymentData.coupon_id,
        pdv_id: paymentData.pdv_id,
        description: paymentData.description,
        transaction_amount: paymentData.transaction_amount,
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
        tickets: paymentData.tickets,
        payment_method: 'card',
        status_id: pendingStatus.id,
      });

      const resultMercadoPago = await this.mercadoPagoService.processCardPayment(paymentData);

      if (!resultMercadoPago.success) {
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        if (!errorStatus) {
          return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Erro" não encontrado');
        }

        await resultProcessPayment.payment
          .merge({
            status_id: errorStatus.id,
            response_data: JSON.stringify(resultMercadoPago),
          })
          .save();

        return utils.handleError(context, 400, 'CARD_PAYMENT_ERROR', `${resultMercadoPago?.error}`);
      }

      let newStatus: any = pendingStatus;

      if (resultMercadoPago.status === 'approved') {
        newStatus = await this.statusesService.searchStatusByName('Aprovado', 'payment');

        try {
          await this.processApprovedPayment(resultProcessPayment.payment, paymentData.tickets);
        } catch (error) {
          return utils.handleError(
            context,
            500,
            'CUSTOMER_TICKETS_ERROR',
            'Erro ao criar customer_tickets para pagamento aprovado'
          );
        }
      } else if (resultMercadoPago.status === 'rejected') {
        newStatus = await this.statusesService.searchStatusByName('Rejeitado', 'payment');
      }

      const responseData = {
        mercado_pago_response: resultMercadoPago.data,
        payment_calculation: {
          totals: resultProcessPayment.totals,
          tickets: resultProcessPayment.tickets,
          coupon_applied: resultProcessPayment.coupon_applied,
        },
        tickets_data: paymentData.tickets,
      };

      await resultProcessPayment.payment
        .merge({
          external_id: resultMercadoPago.external_id,
          external_status: resultMercadoPago.status,
          status_id: newStatus.id,
          response_data: responseData,
          paid_at: resultMercadoPago.status === 'approved' ? DateTime.local() : null,
          last_four_digits: resultMercadoPago.data?.card?.last_four_digits || null,
        })
        .save();

      return utils.handleSuccess(
        context,
        {
          payment_id: resultProcessPayment.payment.id,
          status: resultMercadoPago.status,
          external_id: resultMercadoPago.external_id,
        },
        'CARD_PAYMENT_SUCCESS',
        200
      );
    } catch (error) {
      return utils.handleError(context, 400, 'CARD_PAYMENT_ERROR', `${error}`);
    }
  }

  public async processPixPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(PixPaymentValidator);

      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      if (!pendingStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Pendente" não encontrado');
      }

      // Usar o PaymentCalculationService para manter consistência com o fluxo de cartão
      const resultProcessPayment = await this.paymentCalculationService.processPayment({
        event_id: paymentData.event_id,
        people: paymentData.people,
        description: paymentData.description,
        transaction_amount: paymentData.transaction_amount,
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
        tickets: paymentData.tickets,
        payment_method: 'pix',
        status_id: pendingStatus.id,
      });

      const result = await this.mercadoPagoService.processPixPayment(paymentData);

      if (!result.success) {
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        if (!errorStatus) {
          return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Erro" não encontrado');
        }

        await resultProcessPayment.payment
          .merge({
            status_id: errorStatus.id,
            response_data: { error: result.error },
          })
          .save();

        return utils.handleError(context, 400, 'PIX_PAYMENT_ERROR', `${result.error}`);
      }

      // Processar pagamento aprovado se necessário (PIX pode ser aprovado imediatamente em alguns casos)
      if (result.status === 'approved') {
        try {
          await this.processApprovedPayment(resultProcessPayment.payment, paymentData.tickets);
        } catch (error) {
          return utils.handleError(
            context,
            500,
            'CUSTOMER_TICKETS_ERROR',
            'Erro ao criar customer_tickets para pagamento PIX aprovado'
          );
        }
      }

      const paymentMetadata = {
        mercado_pago_response: result.data,
        payment_calculation: {
          totals: resultProcessPayment.totals,
          tickets: resultProcessPayment.tickets,
          coupon_applied: resultProcessPayment.coupon_applied,
        },
        tickets_data: paymentData.tickets,
      };

      await resultProcessPayment.payment
        .merge({
          external_id: result.external_id,
          external_status: result.status,
          pix_qr_code: result.qr_code,
          pix_qr_code_base64: result.qr_code_base64,
          response_data: paymentMetadata,
          paid_at: result.status === 'approved' ? DateTime.local() : null,
        })
        .save();

      return utils.handleSuccess(
        context,
        {
          payment_id: resultProcessPayment.payment.id,
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

  public async handleWebhook(context: HttpContextContract) {
    try {
      const payload = context.request.body();

      const result = await this.mercadoPagoService.getPaymentStatus(payload.data.id);

      if (!result.success) {
        return utils.handleError(context, 400, 'PAYMENT_CHECK_ERROR', `${result.error}`);
      }

      const payment = await Payments.query().where('external_id', payload.data.id).first();

      if (!payment) {
        return utils.handleError(context, 404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
      }

      let statusName = 'Pendente';

      if (result.status === 'approved') {
        statusName = 'Aprovado';

        if (payment.external_status !== 'approved' && payment.response_data && payment.response_data.tickets_data) {
          try {
            await this.processApprovedPayment(payment, payment.response_data.tickets_data);
          } catch (error) {
            return utils.handleError(
              context,
              500,
              'CUSTOMER_TICKETS_ERROR',
              'Erro ao criar customer_tickets via webhook'
            );
          }
        }
      } else if (result.status === 'rejected') {
        statusName = 'Rejeitado';
      } else if (result.status === 'refunded') {
        statusName = 'Reembolsado';
      }

      const newStatus = await this.statusesService.searchStatusByName(statusName, 'payment');

      if (!newStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', `Status "${statusName}" não encontrado`);
      }

      // Preservar os dados existentes do response_data e adicionar a nova resposta do webhook
      const updatedResponseData = {
        ...payment.response_data,
        webhook_response: result.data,
        last_webhook_update: DateTime.local().toISO(),
      };

      await payment
        .merge({
          external_status: result.status,
          status_id: newStatus.id,
          paid_at: result.status === 'approved' ? DateTime.local() : payment.paid_at,
          response_data: updatedResponseData,
        })
        .save();

      return utils.handleSuccess(
        context,
        {
          payment_id: payment.id,
          updated: true,
        },
        'WEBHOOK_PROCESSED',
        200
      );
    } catch (error) {
      return utils.handleError(context, 400, 'WEBHOOK_ERROR', `${error}`);
    }
  }

  public async getPayment(context: HttpContextContract) {
    try {
      const payment = await Payments.find(context.params.id);

      if (!payment) {
        return utils.handleError(context, 404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
      }

      if (payment.external_id) {
        const result = await this.mercadoPagoService.getPaymentStatus(payment.external_id);
        // console.log('RESULTADO DO GET PAYMENT:', result);

        if (result.success && result.status !== payment.external_status) {
          let statusName = 'Pendente';
          if (result.status === 'approved') {
            statusName = 'Aprovado';
          } else if (result.status === 'rejected') {
            statusName = 'Rejeitado';
          } else if (result.status === 'refunded') {
            statusName = 'Reembolsado';
          }

          const newStatus = await this.statusesService.searchStatusByName(statusName, 'payment');

          if (!newStatus) {
            return utils.handleError(context, 500, 'STATUS_NOT_FOUND', `Status "${statusName}" não encontrado`);
          }

          if (payment.external_status !== 'approved') {
            try {
              if (payment.response_data && payment.response_data.tickets_data) {
                await this.processApprovedPayment(payment, payment.response_data.tickets_data);
              }
            } catch (error) {
              return utils.handleError(context, 500, 'CUSTOMER_TICKETS_ERROR', error);
            }
          }

          await payment
            .merge({
              external_status: result.status,
              status_id: newStatus.id,
              paid_at: result.status === 'approved' ? DateTime.local() : payment.paid_at,
              response_data: result.data,
            })
            .save();
        }

        return utils.handleSuccess(
          context,
          {
            payment: {
              ...payment.$attributes,
              status: result.status,
            },
          },
          'PAYMENT_FOUND',
          200
        );
      }
    } catch (error) {
      return utils.handleError(context, 400, 'PAYMENT_ERROR', `${error}`);
    }
  }

  public async refundPayment(context: HttpContextContract) {
    try {
      const paymentId = context.params.id;

      const payment = await Payments.find(paymentId);

      if (!payment) {
        return utils.handleError(context, 404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
      }

      if (!payment.external_id) {
        return utils.handleError(context, 400, 'INVALID_PAYMENT', 'Pagamento não possui ID externo do Mercado Pago');
      }

      const approvedStatus = await this.statusesService.searchStatusByName('Aprovado', 'payment');

      if (payment.status_id !== approvedStatus?.id) {
        return utils.handleError(
          context,
          400,
          'INVALID_PAYMENT_STATUS',
          'Apenas pagamentos aprovados podem ser reembolsados'
        );
      }

      const result = await this.mercadoPagoService.refundPayment(payment.external_id);

      if (!result.success) {
        return utils.handleError(context, 400, 'REFUND_ERROR', `Erro ao processar reembolso: ${result.error}`);
      }

      const refundedStatus = await this.statusesService.searchStatusByName('Estornado', 'payment');

      if (!refundedStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Estornado" não encontrado');
      }

      const updatedResponseData = {
        ...payment.response_data,
        refund_data: result.data,
        refunded_at: DateTime.local().toISO(),
        refunded_by: context.auth.user?.id,
      };

      await payment
        .merge({
          status_id: refundedStatus.id,
          external_status: 'refunded',
          refunded_at: DateTime.local(),
          response_data: updatedResponseData,
        })
        .save();

      try {
        const cancelledStatus = await this.statusesService.searchStatusByName('Cancelado', 'customer_ticket');

        if (cancelledStatus) {
          const paymentTickets = await PaymentTickets.query().where('payment_id', payment.id);
          const paymentTicketIds = paymentTickets.map((pt) => pt.id);

          if (paymentTicketIds.length > 0) {
            await CustomerTickets.query()
              .whereIn('payment_ticket_id', paymentTicketIds)
              .update({ status_id: cancelledStatus.id });
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar status dos CustomerTickets:', error);
      }

      return utils.handleSuccess(
        context,
        {
          payment_id: payment.id,
          external_id: payment.external_id,
          status: 'refunded',
        },
        'REFUND_SUCCESS',
        200
      );
    } catch (error) {
      return utils.handleError(context, 400, 'REFUND_ERROR', `${error}`);
    }
  }

  private async createTicketFieldsFromTicketsData(paymentTicketIds: string[], ticketsData: any[]): Promise<void> {
    const trx = await Database.transaction();

    try {
      // Buscar os CustomerTickets criados para estes PaymentTickets ordenados por criação
      const customerTickets = await CustomerTickets.query({ client: trx })
        .whereIn('payment_ticket_id', paymentTicketIds)
        .preload('paymentTickets', (query) => {
          query.select('id', 'ticket_id');
        })
        .orderBy('created_at', 'asc');

      console.log('CUSTOMER TICKETS:', customerTickets);

      // Processar os ticket_fields para cada tipo de ticket
      for (const ticketData of ticketsData) {
        if (ticketData.ticket_fields && ticketData.ticket_fields.length > 0 && ticketData.quantity > 0) {
          // Buscar customer_tickets deste tipo de ticket
          const customerTicketsForThisTicket = customerTickets.filter(
            (ct) => ct.paymentTickets.ticket_id === ticketData.ticket_id
          );

          console.log('CUSTOMER TICKETS FOR THIS TICKET:', customerTicketsForThisTicket);

          // Calcular quantos campos por ingresso
          const fieldsPerTicket = ticketData.ticket_fields.length / ticketData.quantity;

          console.log(
            `FIELDS PER TICKET: ${fieldsPerTicket} (total: ${ticketData.ticket_fields.length}, quantity: ${ticketData.quantity})`
          );

          // Para cada customer_ticket, aplicar seus campos correspondentes
          for (let i = 0; i < customerTicketsForThisTicket.length; i++) {
            const customerTicket = customerTicketsForThisTicket[i];

            // Calcular o índice inicial dos campos para este ingresso
            const startIndex = i * fieldsPerTicket;
            const endIndex = startIndex + fieldsPerTicket;

            console.log(`CUSTOMER TICKET ${i}: ${customerTicket.id}, campos [${startIndex}-${endIndex - 1}]`);

            // Aplicar os campos específicos deste ingresso
            for (
              let fieldIndex = startIndex;
              fieldIndex < endIndex && fieldIndex < ticketData.ticket_fields.length;
              fieldIndex++
            ) {
              const fieldData = ticketData.ticket_fields[fieldIndex];

              console.log(`CREATING FIELD [${fieldIndex}] FOR CUSTOMER TICKET ${customerTicket.id}:`, fieldData);

              await TicketFields.create(
                {
                  customer_ticket_id: customerTicket.id,
                  field_id: fieldData.field_id,
                  value: fieldData.value,
                },
                { client: trx }
              );
            }
          }
        }
      }

      await trx.commit();
    } catch (error) {
      console.log('ERRO AO CRIAR TICKET FIELDS:', error);
      await trx.rollback();
      throw error;
    }
  }

  private async processApprovedPayment(payment: Payments, ticketsData: any[]): Promise<void> {
    try {
      if (!payment) {
        throw new Error('Pagamento não encontrado');
      }

      // Buscar PaymentTickets associados ao pagamento
      const paymentTickets = await PaymentTickets.query().where('payment_id', payment.id);

      console.log('PAYMENT TICKETS:', paymentTickets);

      if (paymentTickets.length === 0) {
        throw new Error('Nenhum PaymentTicket encontrado para este pagamento');
      }

      // Verificar se já existem CustomerTickets para este pagamento
      const paymentTicketIds = paymentTickets.map((pt) => pt.id);

      console.log('PAYMENT TICKET IDS:', paymentTicketIds);

      const existingCustomerTickets = await CustomerTickets.query().whereIn('payment_ticket_id', paymentTicketIds);

      console.log('EXISTING CUSTOMER TICKETS:', existingCustomerTickets);

      // Se não existem CustomerTickets, criar usando o PaymentCalculationService
      if (existingCustomerTickets.length === 0 && ticketsData && ticketsData.length > 0) {
        console.log('Criando CustomerTickets...');
        const availableStatus = await this.statusesService.searchStatusByName('Disponível', 'customer_ticket');

        if (!availableStatus) {
          throw new Error('Status "Disponível" não encontrado para customer_ticket');
        }

        // Usar o método do PaymentCalculationService que já está adaptado para a nova estrutura
        await this.paymentCalculationService.createCustomerTicketsFromPayment(payment.id, availableStatus.id);

        console.log('CUSTOMER TICKETS CRIADOS:');

        // Atualizar o current_owner_id dos CustomerTickets criados
        if (payment.people_id) {
          console.log('ATUALIZANDO CURRENT OWNER ID...');

          await CustomerTickets.query()
            .whereIn('payment_ticket_id', paymentTicketIds)
            .update({ current_owner_id: payment.people_id });

          console.log('CURRENT OWNER ID ATUALIZADO:');
        }

        // Criar os TicketFields se fornecidos
        if (ticketsData.some((ticket) => ticket.ticket_fields && ticket.ticket_fields.length > 0)) {
          console.log('Criando TicketFields...');
          await this.createTicketFieldsFromTicketsData(paymentTicketIds, ticketsData);
          console.log('TICKET FIELDS CRIADOS:');
        }
      }
    } catch (error) {
      throw new Error(`Erro ao processar pagamento aprovado: ${error.message}`);
    }
  }
}
