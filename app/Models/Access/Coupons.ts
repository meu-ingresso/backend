import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Status from './Statuses';
import CouponsTickets from './CouponsTickets';

export default class Coupons extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public status_id: string;

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

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @belongsTo(() => Status, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Status>;

  @hasMany(() => CouponsTickets, {
    foreignKey: 'coupon_id',
  })
  public tickets: HasMany<typeof CouponsTickets>;

  @beforeCreate()
  public static assignUuid(coupon: Coupons) {
    coupon.id = uuidv4();
  }
}
