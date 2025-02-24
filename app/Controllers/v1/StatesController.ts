import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateStateValidator, UpdateStateValidator } from 'App/Validators/v1/StatesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class StatesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateStateValidator);

    const ableToCreate = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para criar estados.');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'State',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateStateValidator);

    const ableToUpdate = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para atualizar estados.');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'State',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'UPDATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'UPDATE_SUCCESS', 200);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('State', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para excluir estados.');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'State',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
