import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import CustomerTickets from './CustomerTickets';

export default class Tickets extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

  @column()
  public tier: number;

  @column()
  public total_quantity: number;

  @column()
  public remaining_quantity: number;

  @column()
  public price: number;

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

  @hasMany(() => CustomerTickets, {
    foreignKey: 'ticket_id',
  })
  public customerTickets: HasMany<typeof CustomerTickets>;

  @beforeCreate()
  public static assignUuid(ticket: Tickets) {
    ticket.id = uuidv4();
  }
}
