import DataAccessService from './DataAccessService';
import Address from 'App/Models/Access/Addresses';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class AddressService {
  private dataAccessService = new DataAccessService<typeof Address>(Address);

  public async create(record: Record<string, any>): Promise<Address> {
    const address = new Address().fill(record);

    await Database.transaction(async (trx) => {
      address.useTransaction(trx);

      await address.save();
    });

    return address;
  }

  public async update(record: Record<string, any>): Promise<Address> {
    const address = await Address.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      address.useTransaction(trx);

      address.merge({ ...record });

      await address.save();
    });

    return address;
  }

  public async delete(id: string): Promise<void> {
    const address = await Address.findOrFail(id);

    await Database.transaction(async (trx) => {
      address.useTransaction(trx);

      await address.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
