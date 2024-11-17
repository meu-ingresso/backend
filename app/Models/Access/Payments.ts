import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Users from './Users';
import Statuses from './Statuses';

export default class Payments extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public user_id: string;

  @column()
  public status_id: string;

  @column()
  public payment_method: string;

  @column()
  public gross_value: number;

  @column()
  public net_value: number | null;

  @column.dateTime()
  public paid_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Users, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof Users>;

  @belongsTo(() => Statuses, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Statuses>;

  @beforeCreate()
  public static assignUuid(payment: Payments) {
    payment.id = uuidv4();
  }
}
