import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators/v1/UsersValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class UsersController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateUserValidator);

    const result = await this.dynamicService.bulkCreate({
      modelName: 'User',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    utils.createAudity('CREATE', 'USER', result[0].id, context.auth.user?.$attributes.id, null, result);

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateUserValidator);

    const oldData = await this.dynamicService.getById('User', payload.data[0].id);

    const ableToUpdate = await utils.checkHasAdminPermission(context.auth.user!.id);
    const isOwnUser = oldData.id === context.auth.user!.id;

    if (!ableToUpdate && !isOwnUser) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'User',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    utils.createAudity('UPDATE', 'USER', result[0].id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('User', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const oldData = await this.dynamicService.getById('User', id);

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);
    const isOwnUser = oldData.id === context.auth.user!.id;

    if (!ableToDelete && !isOwnUser) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'ACCESS_DENIED');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'User',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    utils.createAudity('DELETE', 'USER', id, context.auth.user?.$attributes.id, oldData.$attributes, result);

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
