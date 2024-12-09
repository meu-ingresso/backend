import LoginRequest from 'App/Models/Transfer/LoginRequest';
import User from 'App/Models/Access/Users';
import ApiTokens from 'App/Models/Access/Tokens';
import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';

export default class AuthService {
  public async login(payload: LoginRequest): Promise<User | null> {
    const user = await User.query().where('email', payload.email).preload('role').preload('people').first();

    if (!user || !user.is_active || !(await Hash.verify(user.password || '', payload.password))) {
      return null;
    }

    return user;
  }

  public async removeExpiredTokens(userId: string): Promise<void> {
    const now = DateTime.now().toISO();

    await ApiTokens.query().where('user_id', userId).andWhere('expires_at', '<', now).delete();
  }

  public async deleteAllTokens(userId: string): Promise<void> {
    await ApiTokens.query().where('user_id', userId).delete();
  }
}
