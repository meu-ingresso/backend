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
      return utils.handleError(context, 401, 'LOGIN_FAILURE', 'Credenciais inválidas');
    }

    const expiresIn = 302400000;

    const token = await context.auth.use('api').generate(auth as any, { expiresIn });

    utils.createAudity('LOGIN', 'AUTH', auth.id, auth.id, {}, auth);

    return utils.handleSuccess(context, { auth, token }, 'LOGIN_SUCCESS', 200);
  }

  public async logout(context: HttpContextContract) {
    const userId = context.auth.user?.$attributes.id;

    if (!userId) {
      return utils.handleError(context, 401, 'LOGOUT_FAILURE', 'Credenciais inválidas');
    }

    utils.createAudity('LOGOUT', 'AUTH', userId, userId, { revoked: false }, { revoked: true });

    await this.loginService.removeExpiredTokens(userId);

    await context.auth.use('api').revoke();

    return utils.handleSuccess(context, null, 'LOGOUT_SUCCESS', 200);
  }
}
