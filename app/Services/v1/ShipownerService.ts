import DataAccessService from './DataAccessService';
import Shipowner from 'App/Models/Access/Shipowners';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class ShipownersService {
  private dataAccessService = new DataAccessService<typeof Shipowner>(Shipowner);

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
