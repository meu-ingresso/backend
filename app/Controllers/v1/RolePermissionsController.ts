import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateRolePermissionValidator } from 'App/Validators/v1/RolePermissionsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class RolePermissionsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRolePermissionValidator);

    const ableToCreate = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToCreate) {
      return utils.handleError(
        context,
        403,
        'FORBIDDEN',
        'Você não tem permissão para criar relacionamentos entre papéis e permissões.'
      );
    }

    const result = await this.dynamicService.bulkCreate({
      modelName: 'RolePermission',
      records: payload.data,
      userId: context.auth.user?.$attributes.id,
    });

    if (result[0].error) {
      return utils.handleError(context, 400, 'CREATE_ERROR', `${result[0].error}`);
    }

    return utils.handleSuccess(context, result, 'CREATE_SUCCESS', 201);
  }

  public async search(context: HttpContextContract) {
    const query = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.searchActives('RolePermission', query);

    return utils.handleSuccess(context, result, 'SEARCH_SUCCESS', 200);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const ableToDelete = await utils.checkHasAdminPermission(context.auth.user!.id);

    if (!ableToDelete) {
      return utils.handleError(
        context,
        403,
        'FORBIDDEN',
        'Você não tem permissão para excluir relacionamentos entre papéis e permissões.'
      );
    }

    const result = await this.dynamicService.delete({
      modelName: 'RolePermission',
      record: { id },
      userId: context.auth.user?.$attributes.id,
    });

    return utils.handleSuccess(context, result, 'DELETE_SUCCESS', 200);
  }
}
