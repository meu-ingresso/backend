import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';

export default class ApiTokens extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public token: string;

  @column.dateTime()
  public expires_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(apiToken: ApiTokens) {
    apiToken.id = uuidv4();
  }
}
