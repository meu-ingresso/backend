import DataAccessService from './DataAccessService';
import EventFee from 'App/Models/Access/EventFees';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class EventFeeService {
  private dataAccessService = new DataAccessService<typeof EventFee>(EventFee);

  public async create(record: Record<string, any>): Promise<EventFee> {
    const fee = new EventFee().fill(record);

    await Database.transaction(async (trx) => {
      fee.useTransaction(trx);

      await fee.save();
    });

    return fee;
  }

  public async update(record: Record<string, any>): Promise<EventFee> {
    const fee = await EventFee.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      fee.useTransaction(trx);

      fee.merge({ ...record });

      await fee.save();
    });

    return fee;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
