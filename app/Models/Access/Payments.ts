import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import People from './People';
import Statuses from './Statuses';
import Coupons from './Coupons';
import Pdv from './Pdvs';
import Events from './Events';
export default class Payments extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public people_id: string | null;

  @column()
  public status_id: string;

  @column()
  public payment_method: string;

  @column()
  public gross_value: number;

  @column()
  public net_value: number;

  @column()
  public coupon_id: string | null;

  @column()
  public pdv_id: string | null;

  @column.dateTime()
  public paid_at: DateTime | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  // Campos para integração com Mercado Pago
  @column()
  public external_id: string | null;

  @column()
  public external_status: string | null;

  @column()
  public payment_method_details: string | null;

  @column()
  public installments: number | null;

  @column()
  public pix_qr_code: string | null;

  @column()
  public pix_qr_code_base64: string | null;

  @column()
  public last_four_digits: string | null;

  @column()
  public response_data: any;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @belongsTo(() => People, {
    foreignKey: 'people_id',
  })
  public people: BelongsTo<typeof People>;

  @belongsTo(() => Statuses, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Statuses>;

  @belongsTo(() => Coupons, {
    foreignKey: 'coupon_id',
  })
  public coupon: BelongsTo<typeof Coupons>;

  @belongsTo(() => Pdv, {
    foreignKey: 'pdv_id',
  })
  public pdv: BelongsTo<typeof Pdv>;

  @beforeCreate()
  public static assignUuid(payment: Payments) {
    payment.id = uuidv4();
  }
}
