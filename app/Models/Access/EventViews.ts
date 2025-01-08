import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Users from './Users';
import { v4 as uuidv4 } from 'uuid';

export default class EventViews extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public user_id: string;

  @column()
  public session: string;

  @column()
  public ip_address: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(eventAttachment: EventAttachments) {
    eventAttachment.id = uuidv4();
  }
}
