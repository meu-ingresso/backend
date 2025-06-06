import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import AuthValidator from 'App/Validators/v1/AuthValidator';
import GoogleAuthValidator from 'App/Validators/v1/GoogleAuthValidator';
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

    await auth.load('attachments');

    const expiresIn = 302400000;

    const token = await context.auth.use('api').generate(auth as any, { expiresIn });

    const authWithAvatar = {
      ...auth.toJSON(),
      avatar_url: LoginService.getUserAvatar(auth),
    };

    utils.createAudity('LOGIN', 'AUTH', auth.id, auth.id, {}, auth);

    return utils.handleSuccess(context, { auth: authWithAvatar, token }, 'LOGIN_SUCCESS', 200);
  }

  public async googleLogin(context: HttpContextContract) {
    const payload = await context.request.validate(GoogleAuthValidator);

    const auth = await this.loginService.googleLogin(payload);

    if (!auth) {
      return utils.handleError(context, 401, 'GOOGLE_LOGIN_FAILURE', 'Falha na autenticação com Google');
    }

    const expiresIn = 302400000;

    const token = await context.auth.use('api').generate(auth as any, { expiresIn });

    const authWithAvatar = {
      ...auth.toJSON(),
      avatar_url: LoginService.getUserAvatar(auth),
    };

    utils.createAudity('GOOGLE_LOGIN', 'AUTH', auth.id, auth.id, {}, auth);

    return utils.handleSuccess(context, { auth: authWithAvatar, token }, 'GOOGLE_LOGIN_SUCCESS', 200);
  }

  public async me(context: HttpContextContract) {
    try {
      const userId = context.auth.user?.$attributes.id;

      if (!userId) {
        return utils.handleError(context, 401, 'UNAUTHORIZED', 'Token inválido ou expirado');
      }

      // Busca o usuário completo com relacionamentos
      const User = (await import('App/Models/Access/Users')).default;
      const user = await User.query()
        .where('id', userId)
        .whereNull('deleted_at')
        .preload('role')
        .preload('people')
        .preload('attachments')
        .first();

      if (!user) {
        return utils.handleError(context, 404, 'USER_NOT_FOUND', 'Usuário não encontrado');
      }

      // Formata a resposta igual ao login
      const authWithAvatar = {
        ...user.toJSON(),
        avatar_url: LoginService.getUserAvatar(user),
      };

      return utils.handleSuccess(context, { auth: authWithAvatar }, 'USER_DATA_SUCCESS', 200);
    } catch (error) {
      return utils.handleError(context, 500, 'SERVER_ERROR', 'Erro interno do servidor');
    }
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
