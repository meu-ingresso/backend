import User from 'App/Models/Access/Users';

export default class UserService {
  public async getUserInfos(id: string): Promise<any> {
    return User.query().where('id', id).preload('role').first();
  }
}