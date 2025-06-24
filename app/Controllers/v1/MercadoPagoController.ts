import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { CardPaymentValidator, PixPaymentValidator } from 'App/Validators/v1/PaymentsValidator';
import MercadoPagoService from 'App/Services/v1/MercadoPagoService';
import utils from 'Utils/utils';
import Payments from 'App/Models/Access/Payments';
import CustomerTickets from 'App/Models/Access/CustomerTickets';
import TicketFields from 'App/Models/Access/TicketFields';
import Tickets from 'App/Models/Access/Tickets';
import People from 'App/Models/Access/People';
import StatusService from 'App/Services/v1/StatusService';
import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

export default class MercadoPagoController {
  private mercadoPagoService: MercadoPagoService = new MercadoPagoService();
  private statusesService: StatusService = new StatusService();

  public async processCardPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(CardPaymentValidator);

      const resolvedPeopleId = await this.resolvePeopleId(paymentData);

      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      if (!pendingStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Pendente" não encontrado');
      }

      const payment = await Payments.create({
        event_id: paymentData.event_id,
        people_id: resolvedPeopleId,
        coupon_id: paymentData.coupon_id,
        pdv_id: paymentData.pdv_id,
        status_id: pendingStatus.id,
        payment_method: 'credit_card',
        payment_method_details: paymentData.payment_method_id,
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
        installments: paymentData.installments || 1,
      });

      const result = await this.mercadoPagoService.processCardPayment(paymentData);

      if (!result.success) {
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        if (!errorStatus) {
          return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Erro" não encontrado');
        }

        await payment
          .merge({
            status_id: errorStatus.id,
            response_data: JSON.stringify(result),
          })
          .save();

        return utils.handleError(context, 400, 'CARD_PAYMENT_ERROR', `${result?.error}`);
      }

      let newStatus: any = pendingStatus;

      if (result.status === 'approved') {
        newStatus = await this.statusesService.searchStatusByName('Aprovado', 'payment');

        try {
          await this.processApprovedPayment(payment, paymentData.tickets);
        } catch (error) {
          return utils.handleError(
            context,
            500,
            'CUSTOMER_TICKETS_ERROR',
            'Erro ao criar customer_tickets para pagamento aprovado'
          );
        }
      } else if (result.status === 'rejected') {
        newStatus = await this.statusesService.searchStatusByName('Rejeitado', 'payment');
      }

      const responseData = {
        ...result.data,
        tickets_data: paymentData.tickets,
      };

      await payment
        .merge({
          external_id: result.external_id,
          external_status: result.status,
          status_id: newStatus.id,
          response_data: responseData,
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

  public async processPixPayment(context: HttpContextContract) {
    try {
      const paymentData = await context.request.validate(PixPaymentValidator);

      const resolvedPeopleId = await this.resolvePeopleId(paymentData);

      const pendingStatus = await this.statusesService.searchStatusByName('Pendente', 'payment');

      if (!pendingStatus) {
        return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Pendente" não encontrado');
      }

      const payment = await Payments.create({
        event_id: paymentData.event_id,
        people_id: resolvedPeopleId,
        status_id: pendingStatus.id,
        payment_method: 'pix',
        payment_method_details: 'pix',
        gross_value: paymentData.gross_value,
        net_value: paymentData.net_value,
      });

      const result = await this.mercadoPagoService.processPixPayment(paymentData);

      if (!result.success) {
        const errorStatus = await this.statusesService.searchStatusByName('Erro', 'payment');

        if (!errorStatus) {
          return utils.handleError(context, 500, 'STATUS_NOT_FOUND', 'Status "Erro" não encontrado');
        }

        await payment
          .merge({
            status_id: errorStatus.id,
            response_data: result.error,
          })
          .save();

        return utils.handleError(context, 400, 'PIX_PAYMENT_ERROR', `${result[0].error}`);
      }

      const paymentMetadata = {
        ...result.data,
        tickets_data: paymentData.tickets,
      };

      await payment
        .merge({
          external_id: result.external_id,
          external_status: result.status,
          pix_qr_code: result.qr_code,
          pix_qr_code_base64: result.qr_code_base64,
          response_data: paymentMetadata,
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

      await payment
        .merge({
          external_status: result.status,
          status_id: newStatus.id,
          paid_at: result.status === 'approved' ? DateTime.local() : payment.paid_at,
          response_data: result.data,
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

  private async createCustomerTickets(payment: Payments, ticketsData: any[]): Promise<void> {
    const trx = await Database.transaction();

    try {
      if (!payment.people_id) {
        throw new Error('Payment não possui people_id válido');
      }

      const activeStatus = await this.statusesService.searchStatusByName('Disponível', 'customer_ticket');

      if (!activeStatus) {
        throw new Error('Status "Disponível" não encontrado para customer_ticket');
      }

      for (const ticketData of ticketsData) {
        const ticket = await Tickets.findOrFail(ticketData.ticket_id);

        if (ticket.total_sold + ticketData.quantity > ticket.total_quantity) {
          throw new Error(`Estoque insuficiente para o ticket ${ticket.name}`);
        }

        for (let i = 0; i < ticketData.quantity; i++) {
          const customerTicket = await CustomerTickets.create(
            {
              ticket_id: ticketData.ticket_id,
              current_owner_id: payment.people_id,
              status_id: activeStatus.id,
              payment_id: payment.id,
              validated: false,
            },
            { client: trx }
          );

          if (ticketData.ticket_fields && ticketData.ticket_fields.length > 0) {
            for (const fieldData of ticketData.ticket_fields) {
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

        await Tickets.query({ client: trx })
          .where('id', ticketData.ticket_id)
          .increment('total_sold', ticketData.quantity);
      }

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  private async resolvePeopleId(paymentData: any): Promise<string> {
    if (paymentData.people.id) {
      return paymentData.people.id;
    }

    const email = paymentData.people.email;

    if (email) {
      const existingPeople = await People.query().where('email', email).first();

      if (existingPeople) {
        return existingPeople.id;
      }
    }

    const newPeople = await People.create({
      first_name: paymentData.people.first_name,
      last_name: paymentData.people.last_name,
      email: paymentData.people.email,
      tax: paymentData.people.tax || null,
      phone: paymentData.people.phone || null,
      person_type: paymentData.people.person_type || 'PF',
      birth_date: paymentData.people.birth_date || null,
      social_name: paymentData.people.social_name || null,
      fantasy_name: paymentData.people.fantasy_name || null,
      address_id: paymentData.people.address_id || null,
    });

    return newPeople.id;
  }

  private async processApprovedPayment(payment: Payments, ticketsData: any[]): Promise<void> {
    const existingTickets = await CustomerTickets.query().where('payment_id', payment.id);

    if (existingTickets.length === 0 && ticketsData && ticketsData.length > 0) {
      await this.createCustomerTickets(payment, ticketsData);
    }
  }
}
