import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';
import Users from 'App/Models/Access/Users';

export default class AdminRoleMiddleware {
  protected redirectTo = '/unauthorized';

  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.isAuthenticated) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', auth.name, this.redirectTo);
    }

    const user = await Users.query().where('id', auth.user!.id).whereNull('deleted_at').preload('role').firstOrFail();

    if (!user.role || user.role.name !== 'system_admin') {
      throw new AuthenticationException(
        'Forbidden: You do not have the required role to access this resource',
        'E_FORBIDDEN',
        auth.name,
        this.redirectTo
      );
    }

    await next();
  }
}
