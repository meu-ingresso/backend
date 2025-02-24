import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm';
import Event from './Events';

export default class EventGroups extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public description: string | null;

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime;

  @manyToMany(() => Event, {
    pivotTable: 'event_group_relations',
    pivotForeignKey: 'group_id',
    pivotRelatedForeignKey: 'event_id',
  })
  public events: ManyToMany<typeof Event>;

  @beforeCreate()
  public static assignUuid(eventGroup: EventGroups) {
    eventGroup.id = uuidv4();
  }
}
