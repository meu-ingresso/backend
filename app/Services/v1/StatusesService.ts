import DataAccessService from './DataAccessService';
import Status from 'App/Models/Access/Statuses';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class StatusService {
  private dataAccessService = new DataAccessService<typeof Status>(Status);

  public async create(record: Record<string, any>): Promise<Status> {
    const status = new Status().fill(record);

    await Database.transaction(async (trx) => {
      status.useTransaction(trx);

      await status.save();
    });

    return status;
  }

  public async update(record: Record<string, any>): Promise<Status> {
    const status = await Status.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      status.useTransaction(trx);

      status.merge({ ...record });

      await status.save();
    });

    return status;
  }

  public async delete(id: string): Promise<void> {
    const status = await Status.findOrFail(id);

    await Database.transaction(async (trx) => {
      status.useTransaction(trx);

      await status.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
