import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';

export default class AuthApiKey {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    if (request.header('X-Api-Key')) {
      if ((request.header('X-Api-Key') as string) != (Env.get('APP_KEY') as string)) {
        return response.unauthorized();
      }
    }

    await next();
  }
}
