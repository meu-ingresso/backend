import DataAccessService from './DataAccessService';
import Database from '@ioc:Adonis/Lucid/Database';
import UserGroup from 'App/Models/Access/UsersGroups';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class UserGroupService {
  private dataAccessService = new DataAccessService<typeof UserGroup>(UserGroup);

  public async create(record: Record<string, any>): Promise<UserGroup> {
    let userGroup: UserGroup = new UserGroup().fill(record);

    await Database.transaction(async (trx) => {
      userGroup.useTransaction(trx);

      await userGroup.save();
    });

    return userGroup;
  }

  public async update(record: Record<string, any>): Promise<UserGroup> {
    let userGroup: UserGroup = await UserGroup.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      userGroup.useTransaction(trx);

      userGroup.merge({ ...record });

      await userGroup.save();
    });
    return userGroup;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }

  public async removeGroup(userId: string): Promise<void> {
    await UserGroup.query().where('main_user_id', userId).delete();
  }
}
