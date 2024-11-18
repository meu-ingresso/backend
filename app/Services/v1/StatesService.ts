import DataAccessService from './DataAccessService';
import State from 'App/Models/Access/States';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class StateService {
  private dataAccessService = new DataAccessService<typeof State>(State);

  public async create(record: Record<string, any>): Promise<State> {
    const state = new State().fill(record);

    await Database.transaction(async (trx) => {
      state.useTransaction(trx);

      await state.save();
    });

    return state;
  }

  public async update(record: Record<string, any>): Promise<State> {
    const state = await State.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      state.useTransaction(trx);

      state.merge({ ...record });

      await state.save();
    });

    return state;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
