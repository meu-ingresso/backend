import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import {
  CreateRolePermissionValidator,
  UpdateRolePermissionValidator,
} from 'App/Validators/v1/RolePermissionsValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class RolePermissionsController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRolePermissionValidator);

    const result = await this.dynamicService.create('RolePermission', payload);

    await utils.createAudity('CREATE', 'ROLE_PERMISSION', result.id, context.auth.user?.$attributes.id, null, result);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRolePermissionValidator);

    const oldData = await this.dynamicService.getById('RolePermission', payload.id);

    const result = await this.dynamicService.update('RolePermission', payload);

    await utils.createAudity(
      'UPDATE',
      'ROLE_PERMISSION',
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

    const result = await this.dynamicService.search('RolePermission', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
