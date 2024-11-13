import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RolePermissionService from 'App/Services/v1/RolePermissionService';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateRolePermissionValidator,
  UpdateRolePermissionValidator,
} from 'App/Validators/v1/RolePermissionValidator';
import utils from 'Utils/utils';

export default class RolePermissionController {
  private rolePermissionService: RolePermissionService = new RolePermissionService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRolePermissionValidator);

    const result = await this.rolePermissionService.create(payload);

    utils.createAudity(context.auth.user?.$attributes.id, 'role_permission', 'create', result.id);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRolePermissionValidator);

    const resultItem = await this.rolePermissionService.getById(payload.id);

    const audityAction = {
      id: payload.id,
      role_id: resultItem[0].$original.role_id,
      permission_id: resultItem[0].$original.permission_id,
    };

    const result = await this.rolePermissionService.update(payload);

    utils.createAudity(context.auth.user?.$attributes.id, 'role_permission', 'remove', JSON.stringify(audityAction));

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.rolePermissionService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.createAudity(context.auth.user?.$attributes.id, 'role_permission', 'search', JSON.stringify(payload));

    utils.getResponse(context, 200, headers, body);
  }
}
