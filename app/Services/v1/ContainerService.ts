import DataAccessService from './DataAccessService';
import Container from 'App/Models/Access/Containers';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class ContainerService {
  private dataAccessService = new DataAccessService<typeof Container>(Container);

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
