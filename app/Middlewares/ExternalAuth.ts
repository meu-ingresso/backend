import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';

export default class ExternalAuth {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    if (!request.header('X-Api-Key')) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS');
    }

    const acceptKeysString = Env.get('CLIENT_AUTH_KEY', '');

    const acceptKeys = acceptKeysString ? acceptKeysString.split(',').map((key) => key.trim()) : [];

    let isAuthorized = false;

    acceptKeys.map((element) => {
      if (element == request.header('X-Api-Key')) {
        isAuthorized = true;
      }
    });

    if (!isAuthorized) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS');
    }

    await next();
  }
}
