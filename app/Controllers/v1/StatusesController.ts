import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import StatusesService from 'App/Services/v1/StatusesService';
import { CreateStatusValidator, UpdateStatusValidator } from 'App/Validators/v1/StatusesValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class StatusesController {
  private statusesService: StatusesService = new StatusesService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateStatusValidator);

    const result = await this.statusesService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateStatusValidator);

    const result = await this.statusesService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.statusesService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
