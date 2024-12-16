import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Events from 'App/Models/Access/Events';
import Users from 'App/Models/Access/Users';
import EventCollaborators from 'App/Models/Access/EventCollaborators';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';

export default class EventAccessMiddleware {
  public async handle({ auth }: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.check();

      const user = await Users.query().where('id', auth.user!.id).preload('role').firstOrFail();

      if (user.role?.name === 'Admin') {
        return await next();
      }

      const promotedEvents = await Events.query().where('promoter_id', user.id).select('id', 'name', 'promoter_id');

      const collaboratedEventIds = await EventCollaborators.query().where('user_id', user.id).select('event_id');

      const accessibleEvents = [
        ...promotedEvents.map((event) => ({
          id: event.id,
          name: event.name,
        })),
        ...collaboratedEventIds.map((collab) => ({
          id: collab.event_id,
        })),
      ];

      if (accessibleEvents.length === 0) {
        throw new AuthenticationException('Usuário não tem permissão para acessar eventos', 'E_FORBIDDEN');
      }

      // @ts-ignore
      auth.user.accessibleEvents = accessibleEvents;
      await next();
    } catch (error) {
      throw new AuthenticationException('Acesso não autorizado', 'E_UNAUTHORIZED_ACCESS', auth.name, '/login');
    }
  }
}
