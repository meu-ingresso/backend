import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import PermissionService from 'App/Services/v1/PermissionService';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class PermissionController {
  private permissionService: PermissionService = new PermissionService();

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.permissionService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
