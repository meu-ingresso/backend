import LoginRequest from 'App/Models/Transfer/LoginRequest';
import User from 'App/Models/Access/Users';
import ApiTokens from 'App/Models/Access/Tokens';
import Hash from '@ioc:Adonis/Core/Hash';

export default class LoginService {
  public async login(payload: LoginRequest): Promise<any> {
    const user = await User.query()
      .where('email', payload.email)
      .preload('role')
      .preload('groupMainUser', (groupMainUserQuery) => {
        groupMainUserQuery.preload('user');
      })
      .firstOrFail();

    if (!user || !user.is_active || !(await Hash.verify(user.password, payload.password))) {
      return null;
    }

    return user;
  }

  public async removeApiTokens(userId: string): Promise<void> {
    const now = new Date();

    await ApiTokens.query().where('user_id', userId).andWhere('expires_at', '<', now).delete();
  }

  public async deleteAllApiTokens(userId: string): Promise<void> {
    await ApiTokens.query().where('user_id', userId).delete();
  }
}
