import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import CustomerTickets from './CustomerTickets';
import EventCheckoutFields from './EventCheckoutFields';

export default class TicketsFields extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public customer_ticket_id: string;

  @column()
  public field_id: string;

  @column()
  public order: number | null;

  @column()
  public value: string;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => CustomerTickets, {
    foreignKey: 'customer_ticket_id',
  })
  public customerTicket: BelongsTo<typeof CustomerTickets>;

  @belongsTo(() => EventCheckoutFields, {
    foreignKey: 'field_id',
  })
  public eventCheckoutField: BelongsTo<typeof EventCheckoutFields>;

  @beforeCreate()
  public static assignUuid(ticketField: TicketsFields) {
    ticketField.id = uuidv4();
  }
}
