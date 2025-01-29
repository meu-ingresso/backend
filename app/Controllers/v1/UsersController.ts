import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators/v1/UsersValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class UsersController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateUserValidator);

    const result = await this.dynamicService.create('User', payload);

    await utils.createAudity('CREATE', 'USER', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 201, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateUserValidator);

    const oldData = await this.dynamicService.getById('User', payload.id);

    const ableToUpdate = await utils.checkHasAdminPermission(context.auth.user!.id);

    const isOwnUser = oldData.id === context.auth.user!.id;

    if (!ableToUpdate && !isOwnUser) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.update('User', payload);

    await utils.createAudity(
      'UPDATE',
      'USER',
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

    const result = await this.dynamicService.search('User', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('User', id);

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);

    const isOwnUser = oldData.id === context.auth.user!.id;

    if (!ableToDelete && !isOwnUser) {
      return utils.getResponse(context, 403, utils.getHeaders(), utils.getBody('FORBIDDEN', null));
    }

    const result = await this.dynamicService.softDelete('User', { id });

    await utils.createAudity('DELETE', 'USER', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
