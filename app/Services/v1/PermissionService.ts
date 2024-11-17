import DataAccessService from './DataAccessService';
import Permission from 'App/Models/Access/Permissions';
import Database from '@ioc:Adonis/Lucid/Database';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class PermissionService {
  private dataAccessService = new DataAccessService<typeof Permission>(Permission);

  public async create(record: Record<string, any>): Promise<Permission> {
    const permission = new Permission().fill(record);

    await Database.transaction(async (trx) => {
      permission.useTransaction(trx);

      await permission.save();
    });

    return permission;
  }

  public async update(record: Record<string, any>): Promise<Permission> {
    const permission = await Permission.findOrFail(record.id);

    await Database.transaction(async (trx) => {
      permission.useTransaction(trx);

      permission.merge({ ...record });

      await permission.save();
    });

    return permission;
  }

  public async delete(id: string): Promise<void> {
    const permission = await Permission.findOrFail(id);

    await Database.transaction(async (trx) => {
      permission.useTransaction(trx);

      await permission.delete();
    });
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
