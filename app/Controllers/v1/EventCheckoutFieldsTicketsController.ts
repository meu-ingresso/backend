import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventCheckoutFieldTicketValidator } from 'App/Validators/v1/EventCheckoutFieldsTicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventCheckoutFieldsTicketsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCheckoutFieldTicketValidator);

    const result = await this.dynamicService.create('EventCheckoutFieldTicket', payload);

    utils.createAudity(
      'CREATE',
      'EVENT_CHECKOUT_FIELD_TICKET',
      result.id,
      context.auth.user?.$attributes.id,
      null,
      result
    );

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('EventCheckoutFieldTicket', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventCheckoutFieldTicket', id);

    const result = await this.dynamicService.softDelete('EventCheckoutFieldTicket', { id });

    utils.createAudity(
      'DELETE',
      'EVENT_CHECKOUT_FIELD_TICKET',
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
