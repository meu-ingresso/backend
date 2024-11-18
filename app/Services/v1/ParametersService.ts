import DataAccessService from './DataAccessService';
import Parameter from 'App/Models/Access/Parameters';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class ParameterService {
  private dataAccessService = new DataAccessService<typeof Parameter>(Parameter);

  public async create(record: Record<string, any>): Promise<Parameter> {
    const parameter = new Parameter().fill(record);

    await Database.transaction(async (trx) => {
      parameter.useTransaction(trx);

      await parameter.save();
    });

    return parameter;
  }

  public async update(record: Record<string, any>): Promise<Parameter> {
    const parameter = await Parameter.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      parameter.useTransaction(trx);

      parameter.merge({ ...record });

      await parameter.save();
    });

    return parameter;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
