import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateEventFeeValidator, UpdateEventFeeValidator } from 'App/Validators/v1/EventFeesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class EventFeesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateEventFeeValidator);

    const result = await this.dynamicService.create('EventFee', payload);

    await utils.createAudity('CREATE', 'EVENT_FEE', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateEventFeeValidator);

    const oldData = await this.dynamicService.getById('EventFee', payload.id);

    const result = await this.dynamicService.update('EventFee', payload);

    await utils.createAudity(
      'UPDATE',
      'EVENT_FEE',
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

    const result = await this.dynamicService.search('EventFee', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('EventFee', id);

    const result = await this.dynamicService.softDelete('EventFee', { id });

    await utils.createAudity('DELETE', 'EVENT_FEE', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
