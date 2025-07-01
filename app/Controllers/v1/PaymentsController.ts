import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreatePaymentValidator, UpdatePaymentValidator, PdvPaymentValidator } from 'App/Validators/v1/PaymentsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import PaymentCalculationService from 'App/Services/v1/PaymentCalculationService';
import StatusService from 'App/Services/v1/StatusService';
import CustomerTickets from 'App/Models/Access/CustomerTickets';
import TicketFields from 'App/Models/Access/TicketFields';
import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import utils from 'Utils/utils';

export default class PaymentsController {
  private dynamicService: DynamicService = new DynamicService();
  private paymentCalculationService: PaymentCalculationService = new PaymentCalculationService();
  private statusService: StatusService = new StatusService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreatePaymentValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Payment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdatePaymentValidator);

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Payment',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Payment', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.softDelete({
      modelName: 'Payment',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }

  public async processPdvPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(PdvPaymentValidator);

      // Buscar status "Aprovado" para pagamentos
      const approvedStatus = await this.statusService.searchStatusByName('Aprovado', 'payment');
      if (!approvedStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Aprovado" não encontrado');
      }

      // Buscar status "Disponível" para customer_tickets
      const availableStatus = await this.statusService.searchStatusByName('Disponível', 'customer_ticket');
      if (!availableStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Disponível" não encontrado');
      }

      // Processar o pagamento usando o PaymentCalculationService
      // Para PDV, usamos um objeto people simples já que temos o people_id
      const resultProcessPayment = await this.paymentCalculationService.processPayment({
        event_id: paymentData.event_id,
        people: { id: paymentData.people_id }, // Objeto simples com apenas o ID
        coupon_id: paymentData.coupon_id,
        pdv_id: paymentData.pdv_id,
        description: paymentData.description,
        transaction_amount: paymentData.transaction_amount,
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
        tickets: paymentData.tickets,
        payment_method: 'pdv',
        status_id: approvedStatus.id,
      });

      // Atualizar o pagamento para status aprovado e adicionar paid_at
      await resultProcessPayment.payment
        .merge({
          paid_at: DateTime.local(),
          response_data: {
            payment_calculation: {
              totals: resultProcessPayment.calculation.totals,
              tickets: resultProcessPayment.calculation.tickets,
              coupon_applied: resultProcessPayment.calculation.coupon_applied,
            },
            tickets_data: paymentData.tickets,
            pdv_payment: true,
            processed_at: DateTime.local().toISO(),
          },
        })
        .save();

      // Criar os CustomerTickets diretamente (PDV é aprovado imediatamente)
      const customerTickets = await this.paymentCalculationService.createCustomerTicketsFromPayment(
        resultProcessPayment.payment.id,
        availableStatus.id
      );

      // Atualizar o current_owner_id dos CustomerTickets criados com o people_id fornecido
      const paymentTicketIds = resultProcessPayment.paymentTickets.map(pt => pt.id);
      await CustomerTickets.query()
        .whereIn('payment_ticket_id', paymentTicketIds)
        .update({ current_owner_id: paymentData.people_id });

      // Criar os TicketFields se fornecidos
      if (paymentData.tickets.some(ticket => ticket.ticket_fields && ticket.ticket_fields.length > 0)) {
        await this.createTicketFieldsFromTicketsData(paymentTicketIds, paymentData.tickets);
      }

      return utils.handleSuccess(
        context,
        {
          payment_id: resultProcessPayment.payment.id,
          status: 'approved',
          customer_tickets_created: customerTickets.length,
          totals: resultProcessPayment.calculation.totals,
          people_id: paymentData.people_id,
        },
        'PDV_PAYMENT_SUCCESS',
        201
      );
    } catch (error) {
      return utils.handleError(context, 400, 'PDV_PAYMENT_ERROR', `${error.message}`);
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

      // Processar os ticket_fields para cada tipo de ticket
      for (const ticketData of ticketsData) {
        if (ticketData.ticket_fields && ticketData.ticket_fields.length > 0 && ticketData.quantity > 0) {
          
          // Buscar customer_tickets deste tipo de ticket
          const customerTicketsForThisTicket = customerTickets.filter(ct => 
            ct.paymentTickets.ticket_id === ticketData.ticket_id
          );

          // Calcular quantos campos por ingresso
          const fieldsPerTicket = ticketData.ticket_fields.length / ticketData.quantity;

          // Para cada customer_ticket, aplicar seus campos correspondentes
          for (let i = 0; i < customerTicketsForThisTicket.length; i++) {
            const customerTicket = customerTicketsForThisTicket[i];
            
            // Calcular o índice inicial dos campos para este ingresso
            const startIndex = i * fieldsPerTicket;
            const endIndex = startIndex + fieldsPerTicket;

            // Aplicar os campos específicos deste ingresso
            for (let fieldIndex = startIndex; fieldIndex < endIndex && fieldIndex < ticketData.ticket_fields.length; fieldIndex++) {
              const fieldData = ticketData.ticket_fields[fieldIndex];
              
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
      await trx.rollback();
      throw error;
    }
  }
}
