import Database from '@ioc:Adonis/Lucid/Database';
import { DateTime } from 'luxon';

export default class EventService {
  public async getTotalizers(event_id: string): Promise<any> {
    const totalizers = await Database.from('customer_tickets')
      .join('tickets', 'customer_tickets.ticket_id', 'tickets.id')
      .join('payments', 'customer_tickets.payment_id', 'payments.id')
      .where('tickets.event_id', event_id)
      .select('payments.net_value as net_value', 'customer_tickets.created_at as created_at');

    let total = {
      totalSales: 0,
      totalSalesToday: 0,
      totalSalesAmout: 0,
      totalSalesAmountToday: 0,
    };

    const today = DateTime.now();

    for (const totalizer of totalizers) {
      total.totalSales += 1;
      total.totalSalesAmout += Number(totalizer.net_value);

      const createdAt = DateTime.fromJSDate(totalizer.created_at);

      const created = `${createdAt.day}/${createdAt.month}/${createdAt.year}`;
      const todayDate = `${today.day}/${today.month}/${today.year}`;

      if (created === todayDate) {
        total.totalSalesToday += 1;
        total.totalSalesAmountToday += Number(totalizer.net_value);
      }
    }

    return total;
  }
}
