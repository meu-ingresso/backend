import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class EventAttachments extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

  @column()
  public type: string | null;

  @column()
  public image_url: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @beforeCreate()
  public static assignUuid(attachment: EventAttachments) {
    attachment.id = uuidv4();
  }
}
