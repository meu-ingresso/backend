import EventCheckoutFieldsTickets from 'App/Models/Access/EventCheckoutFieldsTickets';

export default class EventCheckoutFieldsTicketsService {
  public async validateExistsEventCheckoutFieldTicket(
    event_checkout_field_id: string,
    ticket_id: string
  ): Promise<any> {
    return EventCheckoutFieldsTickets.query()
      .where('event_checkout_field_id', event_checkout_field_id)
      .andWhere('ticket_id', ticket_id);
  }
}
