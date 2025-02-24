import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import Tickets from './Tickets';
import Coupons from './Coupons';

export default class CouponsTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public coupon_id: string;

  @column()
  public ticket_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Coupons, {
    foreignKey: 'coupon_id',
  })
  public coupon: BelongsTo<typeof Coupons>;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @beforeCreate()
  public static assignUuid(couponTicket: CouponsTickets) {
    couponTicket.id = uuidv4();
  }
}
