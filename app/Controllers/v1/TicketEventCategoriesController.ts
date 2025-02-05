import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateTicketEventCategoryValidator,
  UpdateTicketEventCategoryValidator,
} from 'App/Validators/v1/TicketEventCategoryValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class TicketEventCategoriesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateTicketEventCategoryValidator);

    const result = await this.dynamicService.create('TicketEventCategory', payload);

    await utils.createAudity(
      'CREATE',
      'TICKET_EVENT_CATEGORY',
      result.id,
      context.auth.user?.$attributes.id,
      null,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateTicketEventCategoryValidator);

    const oldData = await this.dynamicService.getById('TicketEventCategory', payload.id);

    const result = await this.dynamicService.update('TicketEventCategory', payload);

    await utils.createAudity(
      'UPDATE',
      'TICKET_EVENT_CATEGORY',
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

    const result = await this.dynamicService.searchActives('TicketEventCategory', payload);

    const resultByRole = await utils.getInfosByRole(context.auth.user!.id, result, 'TicketEventCategory');

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', resultByRole);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('TicketEventCategory', id);

    const result = await this.dynamicService.softDelete('TicketEventCategory', { id });

    await utils.createAudity(
      'DELETE',
      'TICKET_EVENT_CATEGORY',
      id,
      context.auth.user?.$attributes.id,
      oldData.$attributes,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
