import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import Events from './Events';
import { v4 as uuidv4 } from 'uuid';

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

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @belongsTo(() => Events, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Events>;

  @beforeCreate()
  public static assignUuid(eventCheckoutField: EventCheckoutFields) {
    eventCheckoutField.id = uuidv4();
  }
}
