import { DateTime } from 'luxon';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import { v4 as uuidv4 } from 'uuid';

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

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @beforeCreate()
  public static assignUuid(eventAttachment: EventAttachments) {
    eventAttachment.id = uuidv4();
  }
}
