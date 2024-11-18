import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UsersService from 'App/Services/v1/UsersService';
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators/v1/UsersValidator';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import utils from 'Utils/utils';

export default class UsersController {
  private usersService: UsersService = new UsersService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateUserValidator);

    const result = await this.usersService.create(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const payload = await context.request.validate(UpdateUserValidator);

    const result = await this.usersService.update(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.usersService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }
}
