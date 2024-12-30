import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreatePermissionValidator, UpdatePermissionValidator } from 'App/Validators/v1/PermissionsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class PermissionsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreatePermissionValidator);

    const result = await this.dynamicService.create('Permission', payload);

    await utils.createAudity('CREATE', 'PERMISSION', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdatePermissionValidator);

    const oldData = await this.dynamicService.getById('Permission', payload.id);

    const result = await this.dynamicService.update('Permission', payload);

    await utils.createAudity(
      'UPDATE',
      'PERMISSION',
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

    const result = await this.dynamicService.search('Permission', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('Permission', id);

    const result = await this.dynamicService.softDelete('Permission', { id });

    await utils.createAudity(
      'DELETE',
      'PERMISSION',
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
