import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoleService from 'App/Services/v1/RoleService';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class RoleController {
  private roleService: RoleService = new RoleService();

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.roleService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
