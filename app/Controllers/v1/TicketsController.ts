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

    const result = await this.dynamicService.create('Ticket', payload);

    await utils.createAudity('CREATE', 'TICKET', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateTicketValidator);

    const oldData = await this.dynamicService.getById('Ticket', payload.id);

    if (payload.total_quantity === payload.remaining_quantity) {
      const status = await this.statusService.searchStatusByName('Esgotado', 'ticket');

      if (status) {
        payload.status_id = status.id;
      }
    }

    const result = await this.dynamicService.update('Ticket', payload);

    await utils.createAudity(
      'UPDATE',
      'TICKET',
      result.id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Ticket', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'Ticket');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Ticket', id);

    const result = await this.dynamicService.softDelete('Ticket', { id });

    await utils.createAudity('DELETE', 'TICKET', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
