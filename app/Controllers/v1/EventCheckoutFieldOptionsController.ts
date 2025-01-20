import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateEventCheckoutFieldOptionValidator,
  UpdateEventCheckoutFieldOptionValidator,
} from 'App/Validators/v1/EventCheckoutFieldOptionsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventCheckoutFieldOptionsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCheckoutFieldOptionValidator);

    const result = await this.dynamicService.create('EventCheckoutFieldOption', payload);

    await utils.createAudity(
      'CREATE',
      'EVENT_CHECKOUT_FIELD_OPTIONS',
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
    const payload = await context.request.validate(UpdateEventCheckoutFieldOptionValidator);

    const oldData = await this.dynamicService.getById('EventCheckoutFieldOption', payload.id);

    const result = await this.dynamicService.update('EventCheckoutFieldOption', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT_CHECKOUT_FIELD_OPTIONS',
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

    const result = await this.dynamicService.search('EventCheckoutFieldOption', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventCheckoutFieldOption', id);

    const result = await this.dynamicService.softDelete('EventCheckoutFieldOption', { id });

    await utils.createAudity(
      'DELETE',
      'EVENT_CHECKOUT_FIELD_OPTIONS',
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
