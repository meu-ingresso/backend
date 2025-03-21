import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateTicketValidator, UpdateTicketValidator } from 'App/Validators/v1/TicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import StatusService from 'App/Services/v1/StatusService';
import utils from 'Utils/utils';

export default class TicketsController {
  private dynamicService: DynamicService = new DynamicService();
  private statusService: StatusService = new StatusService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateTicketValidator);

    const ableToCreate = await utils.checkHasEventPermission(context.auth.user!.id, payload.data[0].event_id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Ticket',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateTicketValidator);

    payload.data.forEach(async (ticket) => {
      const isTicketSoldOut = ticket.total_quantity && ticket.total_sold && ticket.total_quantity <= ticket.total_sold;

      if (isTicketSoldOut) {
        const status = await this.statusService.searchStatusByName('Esgotado', 'ticket');

        if (status) {
          ticket.status_id = status.id;
        }
      }
    });

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Ticket',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Ticket', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Ticket');

    return utils.handleSuccess(context, resultByRole, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Ticket', id);

    const ableToDelete = await utils.checkHasEventPermission(context.auth.user!.id, oldData.event_id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'Ticket',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
