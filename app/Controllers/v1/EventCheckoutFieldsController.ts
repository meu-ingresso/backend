import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateEventCheckoutFieldValidator,
  UpdateEventCheckoutFieldValidator,
} from 'App/Validators/v1/EventCheckoutFieldsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventCheckoutFieldsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventCheckoutFieldValidator);

    const result = await this.dynamicService.create('EventCheckoutField', payload);

    await utils.createAudity(
      'CREATE',
      'EVENT_CHECKOUT_FIELD',
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
    const payload = await context.request.validate(UpdateEventCheckoutFieldValidator);

    const oldData = await this.dynamicService.getById('EventCheckoutField', payload.id);

    const result = await this.dynamicService.update('EventCheckoutField', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT_CHECKOUT_FIELD',
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

    const result = await this.dynamicService.search('EventCheckoutField', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventCheckoutField', id);

    const result = await this.dynamicService.softDelete('EventCheckoutField', { id });

    await utils.createAudity(
      'DELETE',
      'EVENT_CHECKOUT_FIELD',
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
