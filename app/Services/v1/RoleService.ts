import DataAccessService from './DataAccessService';
import Role from 'App/Models/Access/Roles';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class RolesService {
  private dataAccessService = new DataAccessService<typeof Role>(Role);

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
