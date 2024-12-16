import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';
import Event from 'App/Models/Access/Events';

interface AliasValidationResult {
  alias: string;
  is_valid: boolean;
}

export default class EventService {
  public async getTotalizers(event_id: string): Promise<any> {
    const totalizers = await Database.from('customer_tickets')
      .join('tickets', 'customer_tickets.ticket_id', 'tickets.id')
      .join('payments', 'customer_tickets.payment_id', 'payments.id')
      .where('tickets.event_id', event_id)
      .select('payments.net_value as net_value', 'customer_tickets.created_at as created_at');

    const today = DateTime.now().startOf('day');

    let total = {
      totalSales: 0,
      totalSalesToday: 0,
      totalSalesAmout: 0,
      totalSalesAmountToday: 0,
    };

    for (const totalizer of totalizers) {
      total.totalSales += 1;
      total.totalSalesAmout += Number(totalizer.net_value);

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
    const currentHour = now.toFormat('HH:mm');

    for (const event of events) {
      const eventEndDateOnly = DateTime.fromISO(event.end_date).startOf('day');
      const eventEndingHour = event.ending_hour;

      const isEventFinished =
        eventEndDateOnly < currentDateOnly ||
        (eventEndDateOnly.equals(currentDateOnly) && eventEndingHour < currentHour);

      if (!isEventFinished) {
        return { alias, is_valid: false };
      }
    }

    return { alias, is_valid: true };
  }

  public async getEventByIdWithAllPreloads(event_id: string): Promise<any> {
    return Event.query()
      .where('id', event_id)
      .preload('tickets')
      .preload('attachments')
      .preload('collaborators')
      .preload('coupons')
      .preload('checkoutFields')
      .preload('guests')
      .first();
  }
}
