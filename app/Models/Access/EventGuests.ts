import { DateTime } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm';
import Events from './Events';
import Users from './Users';

export default class EventGuests extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public event_id: string;

  @column()
  public first_name: string;

  @column()
  public last_name: string | null;

  @column()
  public quantity: number;

  @column()
  public guest_by: string;

  @column()
  public validated: boolean;

  @column()
  public validated_by: string | null;

  @column.dateTime()
  public validated_at: DateTime | null;

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

  @belongsTo(() => Users, {
    foreignKey: 'guest_by',
  })
  public addedBy: BelongsTo<typeof Users>;

  @belongsTo(() => Users, {
    foreignKey: 'validated_by',
  })
  public validatedBy: BelongsTo<typeof Users>;

  @beforeCreate()
  public static assignUuid(eventGuest: EventGuests) {
    eventGuest.id = uuidv4();
  }
}
