import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RolesService from 'App/Services/v1/RolesService';
import { CreateRoleValidator, UpdateRoleValidator } from 'App/Validators/v1/RolesValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class RolesController {
  private roleService: RolesService = new RolesService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRoleValidator);

    const result = await this.roleService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRoleValidator);

    const result = await this.roleService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.roleService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
