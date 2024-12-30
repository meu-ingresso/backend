import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';

export default class TicketEventCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public name: string;

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

  @beforeCreate()
  public static assignUuid(ticketEventCategory: TicketEventCategory) {
    ticketEventCategory.id = uuidv4();
  }
}
