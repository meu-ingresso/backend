import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import EventCheckoutFields from './EventCheckoutFields';

export default class EventCheckoutFieldOptions extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_checkout_field_id: string;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime;

  @column.dateTime()
  public deleted_at: DateTime | null;

  @belongsTo(() => EventCheckoutFields, {
    foreignKey: 'event_checkout_field_id',
  })
  public eventCheckoutField: BelongsTo<typeof EventCheckoutFields>;

  @beforeCreate()
  public static assignUuid(eventCheckoutFieldOption: EventCheckoutFieldOptions) {
    eventCheckoutFieldOption.id = uuidv4();
  }
}
