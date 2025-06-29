import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import TicketEventCategories from './TicketEventCategories';
import Statuses from './Statuses';
import EventCheckoutFieldsTickets from './EventCheckoutFieldsTickets';
import PdvTickets from './PdvTickets';
import TicketReservations from './TicketReservations';

export default class Tickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public ticket_event_category_id: string | null;

  @column()
  public name: string;

  @column()
  public description: string;

  @column()
  public total_quantity: number;

  @column()
  public total_sold: number;

  @column()
  public price: number;

  @column()
  public status_id: string;

  @column.dateTime()
  public start_date: DateTime;

  @column.dateTime()
  public end_date: DateTime;

  @column()
  public availability: 'Privado' | 'Publico' | 'PDV';

  @column()
  public display_order: number;

  @column()
  public min_quantity_per_user: number;

  @column()
  public max_quantity_per_user: number;

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

  @belongsTo(() => TicketEventCategories, {
    foreignKey: 'ticket_event_category_id',
  })
  public category: BelongsTo<typeof TicketEventCategories>;

  @belongsTo(() => Statuses, {
    foreignKey: 'status_id',
  })
  public status: BelongsTo<typeof Statuses>;

  @hasMany(() => EventCheckoutFieldsTickets, {
    foreignKey: 'ticket_id',
  })
  public eventCheckoutFieldsTickets: HasMany<typeof EventCheckoutFieldsTickets>;

  @hasMany(() => PdvTickets, {
    foreignKey: 'ticket_id',
  })
  public pdvTickets: HasMany<typeof PdvTickets>;

  @hasMany(() => TicketReservations, {
    foreignKey: 'ticket_id',
  })
  public reservations: HasMany<typeof TicketReservations>;

  @beforeCreate()
  public static assignUuid(ticket: Tickets) {
    ticket.id = uuidv4();
  }
}
