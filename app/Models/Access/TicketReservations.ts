import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Tickets from './Tickets';

export default class TicketReservations extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public ticket_id: string;

  @column()
  public current_ticket_price: number;

  @column()
  public event_absorb_service_fee: boolean;

  @column()
  public event_platform_fee: number;

  @column()
  public quantity: number;

  @column.dateTime()
  public expires_time: DateTime;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @beforeCreate()
  public static assignUuid(reservation: TicketReservations) {
    reservation.id = uuidv4();
  }
}
