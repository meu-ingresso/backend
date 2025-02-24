import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate } from '@ioc:Adonis/Lucid/Orm';

export default class EventGroupRelations extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public group_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @beforeCreate()
  public static assignUuid(eventGroupRelation: EventGroupRelations) {
    eventGroupRelation.id = uuidv4();
  }
}
