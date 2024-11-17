import DataAccessService from './DataAccessService';
import EventCollaborator from 'App/Models/Access/EventCollaborators';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class EventCollaboratorService {
  private dataAccessService = new DataAccessService<typeof EventCollaborator>(EventCollaborator);

  public async create(record: Record<string, any>): Promise<EventCollaborator> {
    const collaborator = new EventCollaborator().fill(record);

    await Database.transaction(async (trx) => {
      collaborator.useTransaction(trx);

      await collaborator.save();
    });

    return collaborator;
  }

  public async update(record: Record<string, any>): Promise<EventCollaborator> {
    const collaborator = await EventCollaborator.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      collaborator.useTransaction(trx);

      collaborator.merge({ ...record });

      await collaborator.save();
    });

    return collaborator;
  }

  public async delete(id: string): Promise<void> {
    const collaborator = await EventCollaborator.findOrFail(id);

    await Database.transaction(async (trx) => {
      collaborator.useTransaction(trx);

      await collaborator.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
