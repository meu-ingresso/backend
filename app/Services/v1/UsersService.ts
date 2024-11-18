import DataAccessService from './DataAccessService';
import User from 'App/Models/Access/Users';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';
import Hash from '@ioc:Adonis/Core/Hash';

export default class UserService {
  private dataAccessService = new DataAccessService<typeof User>(User);

  public async create(record: Record<string, any>): Promise<User> {
    const user = new User().fill(record);

    await Database.transaction(async (trx) => {
      user.useTransaction(trx);

      if (record.password) {
        user.password = await Hash.make(record.password);
      }

      await user.save();
    });

    return user;
  }

  public async update(record: Record<string, any>): Promise<User> {
    const user = await User.findOrFail(record.id);

    if (record.password) {
      record.password = await Hash.make(record.password);
    }

    await Database.transaction(async (trx) => {
      user.useTransaction(trx);

      user.merge({ ...record });

      await user.save();
    });

    return user;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
