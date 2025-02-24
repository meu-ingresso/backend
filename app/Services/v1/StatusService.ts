import Status from 'App/Models/Access/Statuses';

export default class StatusService {
  public async searchStatusByName(name: string, module: string): Promise<Status | null> {
    return Status.query().where('name', name).andWhere('module', module).whereNull('deleted_at').first();
  }
}
