import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateRatingValidator, UpdateRatingValidator } from 'App/Validators/v1/RatingsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class RatingsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRatingValidator);

    const result = await this.dynamicService.create('Rating', payload);

    await utils.createAudity('CREATE', 'RATING', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRatingValidator);

    const oldData = await this.dynamicService.getById('Rating', payload.id);

    const result = await this.dynamicService.update('Rating', payload);

    await utils.createAudity(
      'UPDATE',
      'RATING',
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

    const result = await this.dynamicService.search('Rating', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Rating', id);

    const result = await this.dynamicService.softDelete('Rating', { id });

    await utils.createAudity('DELETE', 'RATING', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
