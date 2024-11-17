import DataAccessService from './DataAccessService';
import Database from '@ioc:Adonis/Lucid/Database';
import User from 'App/Models/Access/Users';
import Tokens from 'App/Models/Access/ApiTokens';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class UserService {
  private dataAccessService = new DataAccessService<typeof User>(User);

  public async create(record: Record<string, any>): Promise<User> {
    let user: User = new User().fill(record);

    await Database.transaction(async (trx) => {
      user.useTransaction(trx);

      await user.save();
    });

    return user;
  }

  public async update(record: Record<string, any>): Promise<User> {
    let user: User = await User.findOrFail(record.id);

    if (record && !record.is_active) {
      await Tokens.query().where('user_id', record.id).delete();
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
