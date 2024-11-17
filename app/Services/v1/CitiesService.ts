import DataAccessService from './DataAccessService';
import City from 'App/Models/Access/Cities';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class CityService {
  private dataAccessService = new DataAccessService<typeof City>(City);

  public async create(record: Record<string, any>): Promise<City> {
    const city = new City().fill(record);

    await Database.transaction(async (trx) => {
      city.useTransaction(trx);

      await city.save();
    });

    return city;
  }

  public async update(record: Record<string, any>): Promise<City> {
    const city = await City.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      city.useTransaction(trx);

      city.merge({ ...record });

      await city.save();
    });

    return city;
  }

  public async delete(id: string): Promise<void> {
    const city = await City.findOrFail(id);

    await Database.transaction(async (trx) => {
      city.useTransaction(trx);

      await city.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
