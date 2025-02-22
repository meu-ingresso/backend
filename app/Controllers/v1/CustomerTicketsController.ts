import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateCustomerTicketValidator,
  UpdateCustomerTicketValidator,
} from 'App/Validators/v1/CustomerTicketsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';
import { DateTime } from 'luxon';
export default class CustomerTicketsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateCustomerTicketValidator);

    const result = await this.dynamicService.create('CustomerTicket', payload);

    utils.createAudity('CREATE', 'CUSTOMER_TICKET', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateCustomerTicketValidator);

    if (payload.validated) {
      payload.validated_by = context.auth.user!.id;
      payload.validated_at = DateTime.now().toISO();
    } else {
      // @ts-ignore
      payload.validated_by = null;
      // @ts-ignore
      payload.validated_at = null;
    }

    const oldData = await this.dynamicService.getById('CustomerTicket', payload.id);

    const result = await this.dynamicService.update('CustomerTicket', payload);

    utils.createAudity(
      'UPDATE',
      'CUSTOMER_TICKET',
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

    const result = await this.dynamicService.searchActives('CustomerTicket', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('CustomerTicket', id);

    const result = await this.dynamicService.softDelete('CustomerTicket', { id });

    utils.createAudity('DELETE', 'CUSTOMER_TICKET', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
