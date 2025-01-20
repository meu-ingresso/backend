import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventCheckoutFieldTicketValidator } from 'App/Validators/v1/EventCheckoutFieldsTicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import EventCheckoutFieldsTicketsService from 'App/Services/v1/EventCheckoutFieldsTicketsService';
import utils from 'Utils/utils';

export default class EventCheckoutFieldsTicketsController {
  private dynamicService: DynamicService = new DynamicService();
  private eventCheckoutFieldsTicketsService: EventCheckoutFieldsTicketsService =
    new EventCheckoutFieldsTicketsService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCheckoutFieldTicketValidator);

    let isAbleToCreate = true;
    let message = 'CREATE_SUCCESS';
    let code = 201;
    let result: any = null;

    const exists = await this.eventCheckoutFieldsTicketsService.validateExistsEventCheckoutFieldTicket(
      payload.event_checkout_field_id,
      payload.ticket_id
    );

    if (exists.length > 0) {
      exists.forEach((element) => {
        if (element.deleted_at === null) {
          isAbleToCreate = false;

          message = 'CREATE_FAILED';

          result = {
            message: 'Já existe um registro com o mesmo evento e ticket',
          };

          code = 404;
        }
      });
    }

    if (isAbleToCreate) {
      result = await this.dynamicService.create('EventCheckoutFieldTicket', payload);

      await utils.createAudity(
        'CREATE',
        'EVENT_CHECKOUT_FIELD_TICKET',
        result.id,
        context.auth.user?.$attributes.id,
        null,
        result
      );
    }

    const headers = utils.getHeaders();

    const body = utils.getBody(message, result);

    utils.getResponse(context, code, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('EventCheckoutFieldTicket', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventCheckoutFieldTicket', id);

    const result = await this.dynamicService.softDelete('EventCheckoutFieldTicket', { id });

    await utils.createAudity(
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
