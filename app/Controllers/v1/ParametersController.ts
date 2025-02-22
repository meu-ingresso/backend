import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateParameterValidator, UpdateParameterValidator } from 'App/Validators/v1/ParametersValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class ParametersController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateParameterValidator);

    const result = await this.dynamicService.create('Parameter', payload);

    utils.createAudity('CREATE', 'PARAMETER', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateParameterValidator);

    const oldData = await this.dynamicService.getById('Parameter', payload.id);

    const result = await this.dynamicService.update('Parameter', payload);

    utils.createAudity(
      'UPDATE',
      'PARAMETER',
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

    const result = await this.dynamicService.searchActives('Parameter', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Parameter', id);

    const result = await this.dynamicService.softDelete('Parameter', { id });

    utils.createAudity('DELETE', 'PARAMETER', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
