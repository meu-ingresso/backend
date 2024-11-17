import DataAccessService from './DataAccessService';
import Database from '@ioc:Adonis/Lucid/Database';
import RolePermission from 'App/Models/Access/RolePermissions';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class RoleService {
  private dataAccessService = new DataAccessService<typeof RolePermission>(RolePermission);

  public async create(record: Record<string, any>): Promise<RolePermission> {
    let role_permission: RolePermission = new RolePermission().fill(record);

    await Database.transaction(async (trx) => {
      role_permission.useTransaction(trx);

      await role_permission.save();
    });

    return role_permission;
  }

  public async update(record: Record<string, any>): Promise<RolePermission> {
    let role_permission: RolePermission = await RolePermission.findOrFail(record.id);

    await RolePermission.query().where('id', record.id).delete();

    return role_permission;
  }

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }

  public async getById(id: string) {
    return RolePermission.query().where('id', id);
  }

  public async getByRoleId(role_id: string) {
    return RolePermission.query().where('role_id', role_id).preload('permission');
  }
}
