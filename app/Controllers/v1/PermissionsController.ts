import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PermissionService from 'App/Services/v1/PermissionsService';
import { CreatePermissionValidator, UpdatePermissionValidator } from 'App/Validators/v1/PermissionsValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class PermissionsController {
  private permissionService: PermissionService = new PermissionService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreatePermissionValidator);

    const result = await this.permissionService.create(payload);

    const headers = utils.getHeaders();
    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdatePermissionValidator);

    const result = await this.permissionService.update(payload);

    const headers = utils.getHeaders();
    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.permissionService.search(payload);

    const headers = utils.getHeaders();
    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
