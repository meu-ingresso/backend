import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Tickets from './Tickets';

export default class CustomerTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public ticket_id: string;

  @column()
  public owner_name: string;

  @column()
  public owner_email: string;

  @column()
  public owner_tax: string | null;

  @column()
  public status: string;

  @column()
  public ticket_identifier: string | null;

  @column()
  public validated: boolean;

  @column.dateTime()
  public validated_at: DateTime | null;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @beforeCreate()
  public static assignUuid(customerTicket: CustomerTickets) {
    customerTicket.id = uuidv4();
  }
}
