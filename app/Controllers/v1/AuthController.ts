import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import LoginService from 'App/Services/v1/AuthService';
import RolePermissionService from 'App/Services/v1/RolePermissionService';
import AuthValidator from 'App/Validators/v1/AuthValidator';
import utils from 'Utils/utils';

export default class LoginController {
  public loginService = new LoginService();
  public rolePermissionService = new RolePermissionService();

  public async login(context: HttpContextContract) {
    const payload = await context.request.validate(AuthValidator);

    const auth = await this.loginService.login(payload);

    const sellers = [];

    auth.groupMainUser.forEach((element) => {
      // @ts-ignore
      sellers.push({ id: element.user.id, id_erp: element.user.id_erp });
    });

    if (!auth) {
      const failedBody = utils.getBody('LOGOUT_FAILED', { message: 'Invalid credentials' });

      return context.response.status(400).send(failedBody);
    }

    const getPermissions = await this.rolePermissionService.getByRoleId(auth.role_id);

    const cleanedPermissions = getPermissions.map((item) => {
      const newItem = {
        module_name: item.permission.module_name,
        module_prefix: item.permission.module_prefix,
      };
      return newItem;
    });

    const data = {
      name: auth.first_name + ' ' + auth.last_name,
      cellphone: auth.cellphone,
      email: auth.email,
      is_active: auth.is_active,
      role_id: auth.role_id,
      role: auth.role.name,
      id_erp: auth.id_erp,
      sellers: sellers,
      permissions: cleanedPermissions,
    };

    await this.loginService.removeApiTokens(auth.id);

    const expiresIn = 604800000;

    const token = await context.auth.use('api').generate(auth, { expiresIn });

    utils.createAudity(auth.id, 'auth', 'login', 'User logged in');

    const body = utils.getBody('LOGIN_SUCCESS', { ...token.toJSON(), payload: { id: auth.id, ...data } });

    context.response.status(200).send(body);
  }

  public async logout(context: HttpContextContract) {
    const headers = utils.getHeaders();

    if (!context.request.header('Authorization')) {
      const failedBody = utils.getBody('LOGOUT_FAILED', { message: 'Invalid credentials', revoked: false });

      return utils.getResponse(context, 400, headers, failedBody);
    }

    utils.createAudity(context.auth.user?.$attributes.id, 'auth', 'logout', 'User logged out');

    await this.loginService.removeApiTokens(context.auth.user?.$attributes.id);

    await context.auth.use('api').revoke();

    const body = utils.getBody('LOGOUT_SUCCESS', { revoked: true });

    utils.getResponse(context, 200, headers, body);
  }
}
