import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Payments from './Payments';
import Tickets from './Tickets';

export default class PaymentTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public payment_id: string;

  @column()
  public ticket_id: string;

  @column()
  public quantity: number;

  @column()
  public ticket_original_price: number;

  @column()
  public coupon_discount_value: number;

  @column()
  public ticket_price_after_coupon: number;

  @column()
  public service_fee_percentage: number | null;

  @column()
  public service_fee_fixed: number | null;

  @column()
  public service_fee_applied: number;

  @column()
  public ticket_final_price: number;

  @column()
  public total_original_value: number;

  @column()
  public total_coupon_discount: number;

  @column()
  public total_service_fee: number;

  @column()
  public total_final_value: number;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Payments, {
    foreignKey: 'payment_id',
  })
  public payment: BelongsTo<typeof Payments>;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @beforeCreate()
  public static assignUuid(paymentTicket: PaymentTickets) {
    paymentTicket.id = uuidv4();
  }
} 