import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import TicketEventCategories from './TicketEventCategories';
import Statuses from './Statuses';
import CustomerTickets from './CustomerTickets';

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
  public remaining_quantity: number;

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
  public min_quantity_per_user: number;

  @column()
  public max_quantity_per_user: number;

  @column()
  public is_active: boolean;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

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

  @hasMany(() => CustomerTickets, {
    foreignKey: 'ticket_id',
  })
  public customerTickets: HasMany<typeof CustomerTickets>;

  @beforeCreate()
  public static assignUuid(ticket: Tickets) {
    ticket.id = uuidv4();
  }
}
