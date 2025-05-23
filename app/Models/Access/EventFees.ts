import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Event from './Events';

export default class EventFees extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public platform_fee: number;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column()
  public deleted_at: DateTime | null;

  @belongsTo(() => Event, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Event>;

  @beforeCreate()
  public static assignUuid(eventFee: EventFees) {
    eventFee.id = uuidv4();
  }
}
