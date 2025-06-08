import { DateTime } from 'luxon';
import Database from '@ioc:Adonis/Lucid/Database';
import TicketReservations from 'App/Models/Access/TicketReservations';
import Tickets from 'App/Models/Access/Tickets';

export default class TicketReservationService {
  public async createReservation(data: any): Promise<TicketReservations | null> {
    await this.cleanupExpiredReservations();

    const trx = await Database.transaction();

    try {
      const ticket = await Tickets.query().where('id', data.ticket_id).forUpdate().useTransaction(trx).first();

      if (!ticket) {
        await trx.rollback();
        throw new Error('Ingresso não encontrado');
      }

      const activeReservations = await TicketReservations.query()
        .where('ticket_id', data.ticket_id)
        .where('expires_time', '>', DateTime.now().toSQL())
        .useTransaction(trx)
        .sum('quantity as total');

      const reservedQuantity = parseInt(activeReservations[0]?.$extras?.total || '0');
      const availableQuantity = ticket.total_quantity - ticket.total_sold - reservedQuantity;

      if (availableQuantity < data.quantity) {
        await trx.rollback();
        throw new Error(`Quantidade indisponível. Disponível: ${availableQuantity}`);
      }

      const reservation = await TicketReservations.create(
        {
          ticket_id: data.ticket_id,
          quantity: data.quantity,
          expires_time: data.expires_time,
        },
        { client: trx }
      );

      await trx.commit();

      return reservation;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  public async cleanupExpiredReservations(): Promise<number> {
    const result = await TicketReservations.query().where('expires_time', '<', DateTime.now().toSQL()).delete();

    return result[0];
  }
}
