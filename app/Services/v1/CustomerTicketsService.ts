import DataAccessService from './DataAccessService';
import CustomerTicket from 'App/Models/Access/CustomerTickets';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class CustomerTicketService {
  private dataAccessService = new DataAccessService<typeof CustomerTicket>(CustomerTicket);

  public async create(record: Record<string, any>): Promise<CustomerTicket> {
    const ticket = new CustomerTicket().fill(record);

    await Database.transaction(async (trx) => {
      ticket.useTransaction(trx);

      await ticket.save();
    });

    return ticket;
  }

  public async update(record: Record<string, any>): Promise<CustomerTicket> {
    const ticket = await CustomerTicket.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      ticket.useTransaction(trx);

      ticket.merge({ ...record });

      await ticket.save();
    });

    return ticket;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
