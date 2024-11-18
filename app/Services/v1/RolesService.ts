import DataAccessService from './DataAccessService';
import Role from 'App/Models/Access/Roles';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class RoleService {
  private dataAccessService = new DataAccessService<typeof Role>(Role);

  public async create(record: Record<string, any>): Promise<Role> {
    const role = new Role().fill(record);

    await Database.transaction(async (trx) => {
      role.useTransaction(trx);

      await role.save();
    });

    return role;
  }

  public async update(record: Record<string, any>): Promise<Role> {
    const role = await Role.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      role.useTransaction(trx);

      role.merge({ ...record });

      await role.save();
    });

    return role;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
