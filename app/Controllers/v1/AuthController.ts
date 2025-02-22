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
      const body = utils.getBody('LOGIN_FAILURE', null);

      return utils.getResponse(context, 401, body);
    }

    const expiresIn = 302400000;

    const token = await context.auth.use('api').generate(auth as any, { expiresIn });

    utils.createAudity('LOGIN', 'AUTH', auth.id, auth.id, {}, auth);

    const body = utils.getBody('LOGIN_SUCCESS', { auth, token });

    utils.getResponse(context, 200, body);
  }

  public async logout(context: HttpContextContract) {
    const userId = context.auth.user?.$attributes.id;

    if (!userId) {
      const body = utils.getBody('LOGOUT_FAILURE', { message: 'Invalid credentials', revoked: false });

      return utils.getResponse(context, 401, body);
    }

    utils.createAudity('LOGOUT', 'AUTH', userId, userId, { revoked: false }, { revoked: true });

    await this.loginService.removeExpiredTokens(userId);

    await context.auth.use('api').revoke();

    const body = utils.getBody('LOGOUT_SUCCESS', null);

    utils.getResponse(context, 200, body);
  }
}
