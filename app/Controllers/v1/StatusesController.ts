import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateStatusValidator, UpdateStatusValidator } from 'App/Validators/v1/StatusesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class StatusesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateStatusValidator);

    const ableToCreate = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToCreate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para criar status.');
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'Status',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateStatusValidator);

    const ableToUpdate = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToUpdate) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para atualizar status.');
    }

    const result = await this.dynamicService.bulkUpdate({
      modelName: 'Status',
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

    const result = await this.dynamicService.search('Status', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToDelete) {
      return utils.handleError(context, 403, 'FORBIDDEN', 'Você não tem permissão para excluir status.');
    }

    const result = await this.dynamicService.softDelete({
      modelName: 'Status',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
