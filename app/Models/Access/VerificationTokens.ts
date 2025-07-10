import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import crypto from 'crypto';

export type TokenType = 'email_verification' | 'password_reset';

export default class VerificationTokens extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public token: string;

  @column()
  public type: TokenType;

  @column()
  public used: boolean;

  @column.dateTime()
  public expires_at: DateTime;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(verificationToken: VerificationTokens) {
    verificationToken.id = uuidv4();
  }

  public static generateToken(): string {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }

  public isExpired(): boolean {
    return DateTime.now() > this.expires_at;
  }

  public async markAsUsed(): Promise<void> {
    this.used = true;
    await this.save();
  }
}
