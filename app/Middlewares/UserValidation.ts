import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Events from 'App/Models/Access/Events';
import Users from 'App/Models/Access/Users';
import EventCollaborators from 'App/Models/Access//EventCollaborators';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';

export default class EventAccessMiddleware {
  public async handle({ auth, params }: HttpContextContract, next: () => Promise<void>) {
    if (!auth.isAuthenticated) {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', auth.name, '/login');
    }

    const user = await Users.query().where('id', auth.user!.id).preload('role').firstOrFail();

    if (user.role?.name === 'system_admin') {
      await next();
      return;
    }

    // VALIDAÇÃO DE ACESSO AOS PARAMETROS
    const eventId = params.id;

    const event = await Events.query().where('id', eventId).first();

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.promoter_id === user.id) {
      await next();
      return;
    }

    const isCollaborator = await EventCollaborators.query()
      .where('event_id', eventId)
      .where('user_id', user.id)
      .first();

    if (isCollaborator) {
      await next();
      return;
    }

    throw new AuthenticationException('Usuário não tem permissões para acessar essa rota', 'E_FORBIDDEN');
  }
}
