import Ticket from 'App/Models/Access/Tickets';

export default class TicketService {
  public async getTicketInfos(id: string): Promise<any> {
    return Ticket.query().where('id', id).whereNull('deleted_at').preload('event').first();
  }
}
