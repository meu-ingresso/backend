import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, belongsTo, BelongsTo, beforeCreate } from '@ioc:Adonis/Lucid/Orm';
import Event from './Events';
import EventGroups from './EventGroups';

export default class EventGroupRelations extends BaseModel {
  @column()
  public id: string;

  @column()
  public event_id: string;

  @column()
  public group_id: string;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @belongsTo(() => Event, {
    foreignKey: 'event_id',
  })
  public event: BelongsTo<typeof Event>;

  @belongsTo(() => EventGroups, {
    foreignKey: 'group_id',
  })
  public group: BelongsTo<typeof EventGroups>;

  @beforeCreate()
  public static assignUuid(eventGroupRelation: EventGroupRelations) {
    eventGroupRelation.id = uuidv4();
  }
}
