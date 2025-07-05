import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import People from './People';
import Statuses from './Statuses';
import Coupons from './Coupons';
import Pdv from './Pdvs';
import Events from './Events';
import PaymentTickets from './PaymentTickets';

export default class Payments extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public identifier: string;

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

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public refunded_at: DateTime | null;

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

  @hasMany(() => PaymentTickets, {
    foreignKey: 'payment_id',
  })
  public paymentTickets: HasMany<typeof PaymentTickets>;

  @beforeCreate()
  public static assignUuid(payment: Payments) {
    payment.id = uuidv4();
  }

  @beforeCreate()
  public static async generateIdentifier(payment: Payments) {
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      const identifier = Payments.generateRandomIdentifier();

      const existingPayment = await Payments.query()
        .where('identifier', identifier)
        .where('event_id', payment.event_id)
        .first();

      if (!existingPayment) {
        isUnique = true;
        payment.identifier = identifier;
      }

      attempts++;
    }

    if (!isUnique) {
      throw new Error('Failed to generate unique identifier');
    }
  }

  private static generateRandomIdentifier(length = 12): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
}
