import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import Event from 'App/Models/Access/Events';

interface AliasValidationResult {
  alias: string;
  is_valid: boolean;
}

interface EventWithTotalizers extends Event {
  totalizers?: any;
}

export default class EventService {
  public async getTotalizers(event_id: string): Promise<any> {
    const totalizers = await Database.from('customer_tickets')
      .join('tickets', 'customer_tickets.ticket_id', 'tickets.id')
      .join('payments', 'customer_tickets.payment_id', 'payments.id')
      .where('tickets.event_id', event_id)
      .select('payments.net_value as net_value', 'customer_tickets.created_at as created_at');

    const today = DateTime.now().startOf('day');

    const totalViews = await Database.from('event_views').where('event_id', event_id).count('* as total');

    let total = {
      totalSales: 0,
      totalSalesToday: 0,
      totalSalesAmount: 0,
      totalSalesAmountToday: 0,
      totalViews: Number(totalViews[0].total),
    };

    for (const totalizer of totalizers) {
      total.totalSales += 1;
      total.totalSalesAmount += Number(totalizer.net_value);

      const createdAt = DateTime.fromJSDate(totalizer.created_at).startOf('day');

      if (createdAt.equals(today)) {
        total.totalSalesToday += 1;
        total.totalSalesAmountToday += Number(totalizer.net_value);
      }
    }

    return total;
  }

  public async validateAlias(alias: string): Promise<AliasValidationResult> {
    const events = await Database.from('events').where('alias', alias);

    if (!events || events.length === 0) {
      return { alias, is_valid: true };
    }

    const now = DateTime.now();
    const currentDateOnly = now.startOf('day');

    for (const event of events) {
      const eventEndDateOnly = DateTime.fromISO(event.end_date).startOf('day');

      const isEventFinished = eventEndDateOnly < currentDateOnly || eventEndDateOnly.equals(currentDateOnly);

      if (!isEventFinished) {
        return { alias, is_valid: false };
      }
    }

    return { alias, is_valid: true };
  }

  public async getEventByIdWithAllPreloads(event_id: string): Promise<any> {
    return Event.query()
      .where('id', event_id)
      .whereNull('deleted_at')
      .preload('tickets')
      .preload('attachments')
      .preload('collaborators')
      .preload('coupons')
      .preload('checkoutFields')
      .preload('guestLists')
      .first();
  }

  public async getByPromoterAlias(alias: string): Promise<any> {

    const promoter = await Database.from('users')
      .where('alias', alias)
      .whereNull('deleted_at')
      .first();

    if (!promoter) {
      return null;
    }

    // Verifica se o papel do usuário é de promotor
    const role = await Database.from('roles')
      .where('id', promoter.role_id)
      .first();

    if (!role || !['Produtor', 'Admin'].includes(role.name)) {
      return null;
    }

    // Busca todos os eventos ativos (Publicados) do promoter
    const events = await Event.query()
      .where('promoter_id', promoter.id)
      .whereNull('deleted_at')
      .whereHas('status', (query) => {
        query.where('name', 'Publicado');
      })
      .preload('status')
      .preload('category')
      .preload('rating')
      .preload('address')
      .preload('promoter', (query) => {
        query.preload('people');
      })
      .preload('tickets', (query) => {
        query.whereNull('deleted_at')
          .where('is_active', true)
          .orderBy('price', 'asc');
      })
      .preload('attachments', (query) => {
        query.whereNull('deleted_at')
          .orderBy('created_at', 'desc');
      })
      .preload('views')
      .preload('fees')
      .preload('groups')
      .orderBy('start_date', 'desc');

    // Adiciona os totalizadores para cada evento
    if (events && events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        const totalizer = await this.getTotalizers(events[i].id);
        (events[i] as EventWithTotalizers).totalizers = totalizer;
      }
    }

    return {
      promoter: {
        id: promoter.id,
        alias: promoter.alias,
        name: await Database.from('people').where('id', promoter.people_id).first().then(p => p?.name),
      },
      events: events || [],
    };
  }
}
