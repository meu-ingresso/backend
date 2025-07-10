import VerificationTokens, { TokenType } from 'App/Models/Access/VerificationTokens';
import Users from 'App/Models/Access/Users';
import SendMailService from './SendMailService';
import { DateTime } from 'luxon';
import Database from '@ioc:Adonis/Lucid/Database';

export default class VerificationService {
  private sendMailService = new SendMailService();

  public async createEmailVerificationToken(userId: string): Promise<VerificationTokens> {
    const user = await Users.query().where('id', userId).preload('people').firstOrFail();

    await this.invalidatePreviousTokens(userId, 'email_verification');

    const token = await VerificationTokens.create({
      user_id: userId,
      token: VerificationTokens.generateToken(),
      type: 'email_verification',
      expires_at: DateTime.now().plus({ minutes: 15 }),
    });

    const userName = `${user.people.first_name} ${user.people.last_name}`;
    await this.sendMailService.sendVerificationEmail(user.email!, userName, token.token);

    return token;
  }

  public async createPasswordResetToken(email: string): Promise<VerificationTokens | null> {
    const user = await Users.query().where('email', email).whereNull('deleted_at').preload('people').first();

    if (!user) {
      return null;
    }

    await this.invalidatePreviousTokens(user.id, 'password_reset');

    const token = await VerificationTokens.create({
      user_id: user.id,
      token: VerificationTokens.generateToken(),
      type: 'password_reset',
      expires_at: DateTime.now().plus({ minutes: 15 }),
    });

    const userName = `${user.people.first_name} ${user.people.last_name}`;
    await this.sendMailService.sendPasswordResetEmail(user.email!, userName, token.token);

    return token;
  }

  public async verifyEmail(token: string, email: string): Promise<Users | null> {
    const verificationToken = await VerificationTokens.query()
      .where('token', token)
      .where('type', 'email_verification')
      .where('used', false)
      .preload('user')
      .first();

    if (!verificationToken || verificationToken.isExpired()) {
      return null;
    }

    // Verifica se o email corresponde ao token
    if (verificationToken.user.email !== email) {
      return null;
    }

    const trx = await Database.transaction();

    try {
      verificationToken.used = true;
      await verificationToken.useTransaction(trx).save();

      const user = verificationToken.user;
      user.account_verified = true;
      await user.useTransaction(trx).save();

      await trx.commit();

      return user;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  public async validatePasswordResetToken(token: string, email: string): Promise<VerificationTokens | null> {
    const verificationToken = await VerificationTokens.query()
      .where('token', token)
      .where('type', 'password_reset')
      .where('used', false)
      .preload('user')
      .first();

    if (!verificationToken || verificationToken.isExpired()) {
      return null;
    }

    // Verifica se o email corresponde ao token
    if (verificationToken.user.email !== email) {
      return null;
    }

    return verificationToken;
  }

  public async resetPassword(token: string, email: string, newPassword: string): Promise<Users | null> {
    const verificationToken = await this.validatePasswordResetToken(token, email);

    if (!verificationToken) {
      return null;
    }

    const trx = await Database.transaction();

    try {
      verificationToken.used = true;
      await verificationToken.useTransaction(trx).save();

      const user = verificationToken.user;
      user.password = newPassword;
      await user.useTransaction(trx).save();

      Database.from('api_tokens').where('user_id', user.id).useTransaction(trx).delete();

      await trx.commit();

      await user.load('people');
      const userName = `${user.people.first_name} ${user.people.last_name}`;
      this.sendMailService.sendPasswordChangedEmail(user.email!, userName);

      return user;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }

  private async invalidatePreviousTokens(userId: string, type: TokenType): Promise<void> {
    const tokens = await VerificationTokens.query().where('user_id', userId).where('type', type).where('used', false);

    for (const token of tokens) {
      await VerificationTokens.query().where('id', token.id).delete();
    }
  }

  public async resendVerificationEmail(userId: string): Promise<boolean> {
    const user = await Users.query().where('id', userId).whereNull('deleted_at').first();

    if (!user || user.account_verified) {
      return false;
    }

    await this.createEmailVerificationToken(userId);
    return true;
  }
}
