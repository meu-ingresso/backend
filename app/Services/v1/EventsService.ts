import DataAccessService from './DataAccessService';
import Event from 'App/Models/Access/Events';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class EventService {
  private dataAccessService = new DataAccessService<typeof Event>(Event);

  public async create(record: Record<string, any>): Promise<Event> {
    const event = new Event().fill(record);

    await Database.transaction(async (trx) => {
      event.useTransaction(trx);

      await event.save();
    });

    return event;
  }

  public async update(record: Record<string, any>): Promise<Event> {
    const event = await Event.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      event.useTransaction(trx);

      event.merge({ ...record });

      await event.save();
    });

    return event;
  }

  public async delete(id: string): Promise<void> {
    const event = await Event.findOrFail(id);

    await Database.transaction(async (trx) => {
      event.useTransaction(trx);

      await event.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
