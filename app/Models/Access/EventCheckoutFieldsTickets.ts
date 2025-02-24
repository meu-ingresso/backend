import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import EventCheckoutFields from './EventCheckoutFields';
import Tickets from './Tickets';

export default class EventCheckoutFieldsTickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_checkout_field_id: string;

  @column()
  public ticket_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => EventCheckoutFields, {
    foreignKey: 'event_checkout_field_id',
  })
  public eventCheckoutField: BelongsTo<typeof EventCheckoutFields>;

  @belongsTo(() => Tickets, {
    foreignKey: 'ticket_id',
  })
  public ticket: BelongsTo<typeof Tickets>;

  @beforeCreate()
  public static assignUuid(eventCheckoutFieldTicket: EventCheckoutFieldsTickets) {
    eventCheckoutFieldTicket.id = uuidv4();
  }
}
