import DataAccessService from './DataAccessService';
import Modal from 'App/Models/Access/Modals';
import { ModelObject } from '@ioc:Adonis/Lucid/Orm';

export default class ModalService {
  private dataAccessService = new DataAccessService<typeof Modal>(Modal);

  public async search(query?: any): Promise<{ meta?: any; data: ModelObject[] }> {
    return this.dataAccessService.search(query);
  }
}
