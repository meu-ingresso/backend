import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Status from 'App/Models/Access/Statuses';
import User from 'App/Models/Access/Users';
import Addresses from './Addresses';

export default class Notifications extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public title: string;

  @column()
  public content: string;

  @column()
  public type: 'admin_to_promoter' | 'promoter_to_customer' | 'admin_to_customer';

  @column()
  public status_id: string;

  @belongsTo(() => Status)
  public status: BelongsTo<typeof Status>;

  @column()
  public sender_id: string;

  @belongsTo(() => User, { foreignKey: 'sender_id' })
  public sender: BelongsTo<typeof User>;

  @column()
  public receiver_id: string;

  @belongsTo(() => User, { foreignKey: 'receiver_id' })
  public receiver: BelongsTo<typeof User>;

  @column.dateTime()
  public read_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @column.dateTime()
  public deletedAt: DateTime | null;

  @beforeCreate()
  public static assignUuid(notification: Notifications) {
    notification.id = uuidv4();
  }
}
