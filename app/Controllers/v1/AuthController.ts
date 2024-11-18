import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AuthValidator from 'App/Validators/v1/AuthValidator';
import LoginService from 'App/Services/v1/AuthService';
import utils from 'Utils/utils';

export default class AuthController {
  private loginService: LoginService = new LoginService();

  public async login(context: HttpContextContract) {
    const payload = await context.request.validate(AuthValidator);

    const auth = await this.loginService.login(payload);

    if (!auth) {
      const headers = utils.getHeaders();

      const body = utils.getBody('LOGIN_FAILURE', null);

      return utils.getResponse(context, 401, headers, body);
    }

    const expiresIn = 302400000;

    const token = await context.auth.use('api').generate(auth, { expiresIn });

    utils.createAudity(auth.id, 'auth', 'login', auth.id);

    const headers = utils.getHeaders();

    const body = utils.getBody('LOGIN_SUCCESS', { auth, token });

    utils.getResponse(context, 200, headers, body);
  }

  public async logout(context: HttpContextContract) {
    const userId = context.auth.user?.$attributes.id;

    if (!userId) {
      const headers = utils.getHeaders();

      const body = utils.getBody('LOGOUT_FAILURE', { message: 'Invalid credentials', revoked: false });

      return utils.getResponse(context, 401, headers, body);
    }

    utils.createAudity(userId, 'auth', 'logout', userId, { revoked: true }, { revoked: false });

    await this.loginService.removeExpiredTokens(userId);

    await context.auth.use('api').revoke();

    const headers = utils.getHeaders();
    const body = utils.getBody('LOGOUT_SUCCESS', null);

    utils.getResponse(context, 200, headers, body);
  }
}
