import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateTicketFieldValidator, UpdateTicketFieldValidator } from 'App/Validators/v1/TicketFieldsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class TicketFieldsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateTicketFieldValidator);

    const result = await this.dynamicService.create('TicketField', payload);

    utils.createAudity('CREATE', 'TICKET_FIELD', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateTicketFieldValidator);

    const oldData = await this.dynamicService.getById('TicketField', payload.id);

    const result = await this.dynamicService.update('TicketField', payload);

    utils.createAudity(
      'UPDATE',
      'TICKET_FIELD',
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

    const result = await this.dynamicService.searchActives('TicketField', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'TicketField');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('TicketField', id);

    const result = await this.dynamicService.softDelete('TicketField', { id });

    utils.createAudity('DELETE', 'TICKET_FIELD', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
