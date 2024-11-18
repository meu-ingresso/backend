import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RolePermissionService from 'App/Services/v1/RolePermissionsService';
import {
  CreateRolePermissionValidator,
  UpdateRolePermissionValidator,
} from 'App/Validators/v1/RolePermissionsValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class RolePermissionsController {
  private rolePermissionService: RolePermissionService = new RolePermissionService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRolePermissionValidator);

    const result = await this.rolePermissionService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRolePermissionValidator);

    const result = await this.rolePermissionService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.rolePermissionService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
