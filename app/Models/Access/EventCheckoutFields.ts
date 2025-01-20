import { BaseModel, column, belongsTo, BelongsTo, beforeCreate, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Events from './Events';
import { v4 as uuidv4 } from 'uuid';
import EventCheckoutFieldsTickets from './EventCheckoutFieldsTickets';

export default class EventCheckoutFields extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

  @column()
  public type: string;

  @column()
  public person_type: string;

  @column()
  public required: boolean;

  @column()
  public is_unique: boolean;

  @column()
  public visible_on_ticket: boolean;

  @column()
  public help_text: string | null;

  @column()
  public order: number;

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

  @hasMany(() => EventCheckoutFieldsTickets, {
    foreignKey: 'event_checkout_field_id',
  })
  public eventCheckoutFieldsTickets: HasMany<typeof EventCheckoutFieldsTickets>;

  @beforeCreate()
  public static assignUuid(eventCheckoutField: EventCheckoutFields) {
    eventCheckoutField.id = uuidv4();
  }
}
