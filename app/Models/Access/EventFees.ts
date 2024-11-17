import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class EventFees extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public platform_fee: number;

  @column()
  public promoter_fee: number;

  @column()
  public fixed_fee: number | null;

  @column()
  public variable_fee: number | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @beforeCreate()
  public static assignUuid(eventFee: EventFees) {
    eventFee.id = uuidv4();
  }
}
