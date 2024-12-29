import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateRoleValidator, UpdateRoleValidator } from 'App/Validators/v1/RolesValidator';
import DynamicService from 'App/Services/v1/DynamicService';
import utils from 'Utils/utils';

export default class RolesController {
  private dynamicService: DynamicService = new DynamicService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateRoleValidator);

    const result = await this.dynamicService.create('Role', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateRoleValidator);

    const result = await this.dynamicService.update('Role', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.dynamicService.search('Role', payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async delete(context: HttpContextContract) {
    const id = context.request.params().id;

    const result = await this.dynamicService.softDelete('Role', { id });

    const headers = utils.getHeaders();

    const body = utils.getBody('DELETE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
