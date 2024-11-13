import DataAccessService from './DataAccessService';
import Permission from 'App/Models/Access/Permissions';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class PermissionsService {
  private dataAccessService = new DataAccessService<typeof Permission>(Permission);

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
