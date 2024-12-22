import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class Coupons extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public code: string;

  @column()
  public discount_type: string;

  @column()
  public discount_value: number;

  @column()
  public max_uses: number;

  @column()
  public uses: number;

  @column.dateTime()
  public start_date: DateTime;

  @column.dateTime()
  public end_date: DateTime;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @beforeCreate()
  public static assignUuid(coupon: Coupons) {
    coupon.id = uuidv4();
  }
}
