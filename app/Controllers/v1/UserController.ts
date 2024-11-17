import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import UserService from 'App/Services/v1/UserService';
import UserGroupService from 'App/Services/v1/UserGroupService';
import LoginService from 'App/Services/v1/AuthService';
import QueryModelValidator from 'App/Validators/v1/QueryModelValidator';
import { CreateUserValidator, UpdateUserValidator } from 'App/Validators/v1/UsersValidator';
import utils from 'Utils/utils';

export default class UserController {
  private userService: UserService = new UserService();
  private userGroupService: UserGroupService = new UserGroupService();
  private loginService: LoginService = new LoginService();

  public async create(context: HttpContextContract) {
    const payload = await context.request.validate(CreateUserValidator);

    const result = await this.userService.create(payload);

    utils.createAudity(context.auth.user?.$attributes.id, 'user', 'create', result.id);

    const headers = utils.getHeaders();

    const body = utils.getBody('CREATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async update(context: HttpContextContract) {
    const params = utils.sanitizeParams(context.request.body());

    const sellers = params.sellers;

    delete params.sellers;

    context.request.updateBody(params);

    const payload = await context.request.validate(UpdateUserValidator);

    const result = await this.userService.update(payload);

    await this.userGroupService.removeGroup(result.id);

    if (sellers && sellers.length > 0) {
      sellers.forEach((element) => {
        this.userGroupService.create({ main_user_id: result.id, user_id: element });
      });

      utils.createAudity(context.auth.user?.$attributes.id, 'userGroup', 'update', JSON.stringify(sellers));
    }

    await this.loginService.deleteAllApiTokens(result.id);

    utils.createAudity(context.auth.user?.$attributes.id, 'user', 'update', JSON.stringify(payload));

    const headers = utils.getHeaders();

    const body = utils.getBody('UPDATE_SUCCESS', result);

    utils.getResponse(context, 200, headers, body);
  }

  public async search(context: HttpContextContract) {
    const payload = await context.request.validate(QueryModelValidator);

    const result = await this.userService.search(payload);

    const headers = utils.getHeaders();

    const body = utils.getBody('SEARCH_SUCCESS', result);

    utils.createAudity(context.auth.user?.$attributes.id, 'user', 'search', JSON.stringify(payload));

    utils.getResponse(context, 200, headers, body);
  }
}
