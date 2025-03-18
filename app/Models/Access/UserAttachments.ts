import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import { v4 as uuidv4 } from 'uuid';

export default class UserAttachments extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public name: string;

  @column()
  public type: string | null;

  @column()
  public value: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(userAttachment: UserAttachments) {
    userAttachment.id = uuidv4();
  }
}
